class ShowDate {
    plusZero = (value) => ((value >= 0) && (value <= 9) && (value.toString().length === 1)) ? "0" + value : value;
    minutes = (date) => this.plusZero(date.getMinutes());
    hours = (date) => this.plusZero(date.getHours());
    seconds = (date) => this.plusZero(date.getSeconds());
    day = (date) => this.plusZero(date.getDate());
    month = (date) => this.plusZero(date.getMonth() + 1);
    year = (date) => `${date.getFullYear()}`;
    show(format = 'hh:mi:ss dd.mm.yyyy', date) {
        date = date ? new Date(date) : new Date();
        const year_length = [...format].filter(el => el === 'y').length;
        const year = year_length === 2 ? this.year(date).slice(2, 4) : this.year(date);
        return format
            .replace(/mi/g, `${this.minutes(date)}`)
            .replace(/hh|h/g, `${this.hours(date)}`)
            .replace(/ss|s/g, `${this.seconds(date)}`)
            .replace(/dd|d/g, `${this.day(date)}`)
            .replace(/mm|m/g, `${this.month(date)}`)
            .replace(/yy/g, 'y')
            .replace(/yy/g, 'y')
            .replace(/y/g, year);
    };
};

class Templates {
    constructor(){}

    //CALENDAR
    calendarCalendar() {
        return `<p class="mainform_title"></p>
        <div class="calendar_wrap">
            <div class="container">
                <div class="calendar">
                    <div class="year">
                        <i class="fas fa-angle-left prev_year"></i>
                        <div class="date_year">
                            <h1></h1>
                        </div>
                        <i class="fas fa-angle-right next_year"></i>
                    </div>
                    <div class="month">
                        <i class="fas fa-angle-left prev"></i>
                        <div class="date">
                            <h1></h1>
                        </div>
                        <i class="fas fa-angle-right next"></i>
                    </div>
                    <div class="weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div class="days"></div>
                </div>
            </div>
        </div>`
    }

    template(type, data) {
        const type_res = type.includes('menu') ? 'menu' : type;
        return this[type_res](data);
    };
};

class ModalWindow extends Templates {
    constructor(){
        super();
        this.modal_place = service.$('.modal_wrap')[0];
    }

    closeBtn() { this.modal_place.innerHTML = '' };
    closeSub() { service.$('.wrap_sub_modal')[0].innerHTML = '' };
    closeWrap(event) {
        let valClose = true;
        for (let element of event.target.children) {
            if (element.classList && element.classList.contains('modal_place')) {
                valClose = false;
            };
        };
        if (!valClose) { this.modal_place.innerHTML = '' };
    }

    show(module, type, data = {}, id) {
        const window_type = (type === "Del" || type === 'Res') ? type.toLowerCase() : module + type;
        data.module = module;
        id && (data.id = id);
        const place = (['Towns', 'Times'].includes(type)) ? service.$('.wrap_sub_modal')[0] : this.modal_place;
        const wrap_close_arr = ['townSave', 'transferSave', 'newsSave', 'transferTowns', 'transferTimes'];
        const wrap_close = wrap_close_arr.includes(window_type) ? '' : `onclick="${module}.closeWrap(event)"`;
        const no_close_btn = ['transferTowns', 'transferTimes'].includes(window_type) ? '' : `<i class="fa fa-times" onclick="${module}.closeBtn()"></i>`;
        place.innerHTML =  `<div class="modal_body" ${wrap_close}>
            <div class="modal_close">${no_close_btn}</div>
            <div class="modal_place" id="${window_type}" style="${window_type === "newsSave" ? 'max-width: 90%' : '' }">
                ${this.template(window_type, data)}
            </div>
            <div class="wrap_sub_modal"></div>
        </div>`;
    };
};

class Services {
    metods = {
        create: "POST",
        edit: "PUT",
    }
    language = 'uk';
    lang = {};

    constructor(){}

    $(value, parent = document) {return parent.querySelectorAll(value)};

    transliterate(word) {
        const a = {
            "Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z",
            "Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh",
            "щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O",
            "Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o",
            "л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'",
            "Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
        return word.split('').map((char) => a[char] || char ).join("");
    };

    tabs(tab) {
        tab = (tab === 'null' || tab === undefined) ? 0 : tab;
        const tabs = service.$('.tabs > p');
        const bodys = service.$('.tab_bodys > .body');
        tabs.forEach(element => { element.classList.remove('tab_active') });
        bodys.forEach(element => { element.classList.remove('body_active') });
        localStorage.setItem("tab", tab);
        tabs[tab].classList.add('tab_active');
        bodys[tab].classList.add('body_active');
    }

    slider(el) {
        const active = el.classList.contains('active_sl');
        service.$('.slider > p').forEach(element => { element.classList.remove('active_sl') });
        active ? null : el.classList.toggle('active_sl');
    };

    token(length, type = 'string') {
        let res = '';
        const array = (type === 'number') ? '123456789' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        for ( var i = 0; i < length; i++ ) {res += array.charAt(Math.floor(Math.random() * array.length))}
        return res;
    }

    async languagePack(lang) {
        return new Promise((resolve, reject) => {
            fetch(`./json/${lang}.json`)
            .then(response =>  response.json())
            .then(response => resolve(response))
        });
    }

    setLang = (lang) => {
        document.cookie = `lang=${lang}`;
        document.location.reload();
    }

    async getLang() {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + 'lang'.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        this.language = matches ? decodeURIComponent(matches[1]).slice(0, 2) : 'en';
    }
};

class Static {
    dropdowns = service.$('.menu');
    counter = this.makeCounter();

    makeCounter() {
        let privateCounter = 0;
        const changeBy = val => privateCounter += val;
        return {
            increment: () => changeBy(1),
            decrement: () => changeBy(-1),
            value: () => privateCounter
        };
    };

    menuAnimation(change) {
        const windowWidth = window.innerWidth;
        const border = change === 'decrement' ? 0 : 10;
        let animation = setInterval(() => {
            if (change === 'decrement') { this.counter.decrement() };
            if (change === 'increment') { this.counter.increment(); };
            let count = this.counter.value();
            if (windowWidth < 767) {
                this.dropdowns[0].style.width = `${count*10}%`
            };
            this.dropdowns[0].style.maxWidth = windowWidth < 767 ? `${count*10}%` : `${50 + count*20}px`;
            this.dropdowns[0].style.opacity = `${0 + count/10}`;
            this.dropdowns[0].style.fontSize = `${count + 4}px`;
            if (count === border) { clearInterval(animation) };
        }, 13);
    };

    showMenu() {
        if (this.dropdowns[0].classList.contains('menu_show')) {
            setTimeout(() => { this.dropdowns[0].classList.remove('menu_show') }, 200);
            this.menuAnimation('decrement');
        } else {
            this.dropdowns[0].classList.add('menu_show');
            this.menuAnimation('increment');
        };
    };
}

class ValidationClass {
    RegExpArr = {
        RegExpInput : new RegExp(/[^a-zA-Zа-яА-Я0-9-()_+=!?.:;/\,іІїЇєЄ /\n]/g),
        RegExpNews : new RegExp(/[^a-zA-Zа-яА-Я0-9-()_+=!?.:;'"/\,іІїЇєЄ<> /\n]/g),
        RegExpPhone : new RegExp(/[^0-9-()+ /\n]/g),
        RegExpName : new RegExp(/[^a-zA-Zа-яА-Я-іІїЇєЄ /\n]/g),
        RegExpEmail : new RegExp(/[^a-zA-Z0-9.&@-_]/g)
    }

    validate(el, type) {
        const val = `${el.value.replace(this.RegExpArr[`RegExp${type}`] , "")}`;
        el.value = val.replace(/\s\s+/g, ' ');
    }

    name(el, type) { this.validate(el, type) }

    validEmail = text => (text.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? true : false;
    validPhone = text => (text.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)) ? true : false;
}

class Calendar extends ModalWindow {
    weekdays = {
        uk : ["Нед", "Пон", "Вівт", "Сер", "Чет", "П`ят", "Суб"],
        en : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }
    months = {
        uk : ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        en : ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
    }
    date = '';

    constructor(){
        super();
    }

    showWindow(module, type, el){
        this.date = new Date();
        let val = 0;
        let current_year = this.date.getFullYear();
        this.show(module, type);
        service.$(`#${module + type}`)[0].children[0].innerHTML = service.lang['calendar_title'];
        const weekdays_place = service.$(".weekdays")[0];
        weekdays_place.innerHTML = '';
        this.weekdays[service.language].forEach(el => { weekdays_place.innerHTML += `<div>${el}</div>` });
        service.$(".prev_year")[0].addEventListener("click", () => {
            (val <= 0) ? val = 0 : val--;
            this.render(current_year + val);
        });
        service.$(".next_year")[0].addEventListener("click", () => {
            (val >= 15) ? val = 15 : val++;
            this.render(current_year + val);
        });
        service.$(".prev")[0].addEventListener("click", () => {
            this.date.setMonth(this.date.getMonth() - 1);
            (this.date.getMonth() === 11) && val--;
            this.render(current_year + val);
        });
        service.$(".next")[0].addEventListener("click", () => {
            this.date.setMonth(this.date.getMonth() + 1);
            (this.date.getMonth() === 0) && val++;
            this.render(current_year + val);
        });
        this.render(current_year + val);
    }

    render(current_year) {
        this.date.setDate(1);
        this.date.setYear(current_year);
        let days = "";
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const month_before = this.date.getDay();
        const month_after = 7 - new Date(year, month + 1, 0).getDay() - 1;
        const month_last_day = new Date(year, month + 1, 0).getDate();
        const today = `${date.show('yyyy-mm-dd', new Date())}`;
        for (let i = month_before; i > 0; i--) {
            days += `<div class="prev-date">${new Date(year, month, 0).getDate() - i + 1}</div>`;
        };
        for (let i = 1; i <= month_last_day; i++) {
            const sample = `${year}-${month + 1}-${i}`;
            const compare = `${date.show('yyyy-mm-dd', sample)}`;
            const select = date.show('dd/mm/yyyy', sample);
            if (compare === today) {
                days += `<div class="today" onclick="calendar.select('${select}')">${i}</div>`;
            } else if (compare < today) {
                days += `<div class="prev-date">${i}</div>`;
            } else {
                days += `<div onclick="calendar.select('${select}')">${i}</div>`;
            };
        };
        for (let i = 1; i <= month_after; i++) {
            days += `<div class="next-date">${i}</div>`;
        };
        service.$(`.date_year > h1`)[0].innerHTML = year;
        service.$(".date h1")[0].innerHTML = this.months[service.language][month];
        service.$(".days")[0].innerHTML = days;
    }

    select(date) {
        const inputPlace = service.$(`#main_date`)[0];
        inputPlace.value = date;
    };
};

class Settings {
    disable(child_list) {

    }

    enable(child_list) {

    }

    save(value, param, child_list) {
        fetch(`/settings/${param}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ value }) })
        .then(response => response.status === 200 && response.json())
        .then(resultat => {
            if (!resultat) { throw new Error() };
            if (resultat.res) {

            };
        })
        .catch(() => {
            const error_body = service.$(`.settings_error`)[0];
            error_body.style.display = 'block';
            setTimeout(() => {
                error_body.style.display = 'none';
            }, 3000);
        });
    }

    language(value) {
        this.save(value, 'language');
    }

}

const validation = new ValidationClass();
const service = new Services();
const settings = new Settings();
const loadStatic = new Static();
const date = new ShowDate();
const calendar = new Calendar();

window.onload = function() {};
window.onscroll = function() {};

window.onclick = function(event) {
    if ((!event.target.matches('.drop_menu')) && (!event.target.matches('.drop_menu > i'))) {
        for (let i = 0; i < loadStatic.dropdowns.length; i++) {
            if (loadStatic.dropdowns[i].classList.contains('menu_show')) {
                setTimeout(() => { loadStatic.dropdowns[i].classList.remove('menu_show') }, 200);
                loadStatic.menuAnimation('decrement');
            };
        };
    };
};