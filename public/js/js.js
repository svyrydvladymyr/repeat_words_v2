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

    fieldss(data) {

        const field_list =  Object.keys(data.fields);



        // for (let i = 0; i < field_list.length; i++) {
        //     if (data.fields[i].type === 'text') {
        //         return `<div class="blok">
        //             <label for="${data.fields[i].name}">${data.field_names[data.fields[i].name]}</label>
        //             <input type="text" name="${data.fields[i].name}" id="${data.fields[i].name}">
        //         </div>`
        //     }
        //     if (data.fields[i].type === 'select') {
        //         return `<div class="blok">
        //             <label for="${data.fields[i].name}">${data.field_names[data.fields[i].name]}</label>
        //             <select name="${data.fields[i].name}" id="${data.fields[i].name}">
        //                 <option value="one">one</option>
        //                 <option value="two">two</option>
        //                 <option value="three">three</option>
        //             </select>
        //         </div>`
        //     }
        // }
        return field_list.map((field) => {
            if (data.fields[field].type === 'text') {
                return `<div class="blok">
                    <label for="${data.fields[field].name}">${data.field_names[field]}</label>
                    <input type="text" name="${data.fields[field].name}" id="${data.fields[field].name}">
                </div>`
            }
            if (data.fields[field].type === 'select') {
                return `<div class="blok">
                    <label for="${data.fields[field].name}">${data.field_names[field]}</label>
                    <select name="${data.fields[field].name}" id="${data.fields[field].name}">
                        <option value="one">one</option>
                        <option value="two">two</option>
                        <option value="three">three</option>
                    </select>
                </div>`
            }
        })
    }

    listsadd(data) {
        console.log('listsadd data', data);
        console.log('listsadd data', data.fields);
        console.log('listsadd data', this.fieldss(data).join(''));

        return this.fieldss(data).join('')
    }
    // listsaddddd(data) {
    //     console.log('datadatadata', data);
    //     return `
    //     <p>sssssssssssssss</p>
    //     <p>sssssssssssssss</p>
    //     <p>sssssssssssssss</p>
    //     <p>sssssssssssssss</p>
    //     <p>sssssssssssssss</p>
    //     <p>sssssssssssssss</p>
    //     <p>sssssssssssssss</p>
    //     <p>sssssssssssssss</p>`
    // }

    template(data) {
        return this[data.window_type](data);
    };
};

class ModalWindow extends Templates {
    icon = {
        add: '<i class="fas fa-plus"></i>',
        edit: '<i class="far fa-edit"></i>',
        delete: '<i class="far fa-trash-alt"></i>'
    }

    constructor(){
        super();
        this.modal_place = service.$('.modal_wrap')[0];
    }

    closeBtn() { this.modal_place.innerHTML = '' };
    closeSub() { service.$('.sub_modal_wrap')[0].innerHTML = '' };

    show(module, type, data = {}, id) {
        const sub_list = [];
        // const window_type = (type === "Del" || type === 'Res') ? type.toLowerCase() : module + type;
        // const no_close_btn = ['transferTowns', 'transferTimes'].includes(data.window_type) ? '' : `<i class="fa fa-times" onclick="${module}.closeBtn()"></i>`;
        // const place = (sub_list.includes(type)) ? service.$('.sub_modal_wrap')[0] : this.modal_place;

        data.module = module;
        data.window_type = module + type;
        if (sub_list.includes(type)) {
            data.place = service.$('.sub_modal_wrap')[0];
            data.place_class = 'place_sub';
            data.close_btn = 'Sub';
        } else {
            data.place = this.modal_place;
            data.place_class = '';
            data.close_btn = 'Btn';
        };

        // console.log('module', module);
        // console.log('type', type);
        // id && (data.id = id);

        data.place.innerHTML =
            `<div class="modal_body">
                <div class="place ${data.place_class}" id="${data.window_type}">
                    <div class="close">
                        <p onclick="${data.module}.close${data.close_btn}()">${data.field_names.close}</p>
                        <i class="fa fa-times" onclick="${data.module}.close${data.close_btn}()"></i>
                    </div>
                    <h4>${data.field_names.title + ' ' + data.icon}</h4>
                    ${this.template(data)}
                </div>
                <div class="sub_modal_wrap"></div>
            </div>`;
    };
};

class Services {
    metods = {
        create: "POST",
        edit: "PUT",
    }
    language = 'en';
    lang = {};

    constructor(){}

    $(value, parent = document) {return parent.querySelectorAll(value)};

    redirect(path) {window.location.replace(path)};

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

    setLang = (lang) => {
        document.cookie = `lang=${lang}`;
    }

    async languagePack(lang) {
        return new Promise((resolve, reject) => {
            fetch(`./json/${lang}.json`)
            .then(response =>  response.json())
            .then(response => resolve(response))
        });
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
    disable(list, value) {
        [...list].forEach(element => {
            element.disabled = value;
        });
    }

    async save(value, param, list) {


        console.log('list', list);
        return new Promise((resolve) => {
            this.disable(list, true);
            fetch(`/setsettings/${param}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify({ value }) })
            .then(response => response.status === 200 && response.json())
            .then(resultat => {
                if (!resultat) { throw new Error() };
                if (resultat.res) {
                    this.disable(list, false);
                    resolve(true);
                };
            })
            .catch(() => {
                const error_body = service.$(`.settings_error > span`)[0];
                const error_mess = service.$(`.settings_error > b`)[0];
                error_body.style.display = 'flex';
                error_mess.style.display = 'flex';
                setTimeout(() => {
                    error_body.style.display = 'none';
                    error_mess.style.display = 'none';
                    this.disable(list, false);
                }, 3000);
            });
        });
    }

    list(name) {
        return service.$(`.${name}`)[0].children;
    }

    async language(value) {
        service.setLang(value);
        await this.save(value, 'language', this.list('language')) && location.reload();
    }

    async localization(value) {
        value === 'en-GB' && service.setLang(value);
        await this.save(value, 'localization', this.list('localization')) && location.reload();
    }

    async color(value) {
        await this.save(value, 'color', this.list('color')) && location.reload();
    }

    async voice(select) {
        await this.save(select.value, 'voice', this.list('voice'));
    }

    async speed(value) {
        service.$(`#speed_value`)[0].innerHTML = value.value;
        await this.save(value.value, 'speed', this.list('speed'));
    }

    async pitch(value) {
        service.$(`#pitch_value`)[0].innerHTML = value.value;
        await this.save(value.value, 'pitch', this.list('pitch'));
    }
}

class Lists extends ModalWindow {
    fields = {
        name: {
            name : "list_name",
            type : "text",
            value : [],
            options : [],
            fun : [
                { onclick : [] },
                { onfocus : [] }
            ]
        },
        name2: {
            name : "list_name",
            type : "text",
            value : [],
            options : [],
            fun : [
                { onclick : [] },
                { onfocus : [] }
            ]
        },
        name3: {
            name : "list_name",
            type : "text",
            value : [],
            options : [],
            fun : [
                { onclick : [] },
                { onfocus : [] }
            ]
        },
        name4: {
            name : "list_name",
            type : "text",
            value : [],
            options : [],
            fun : [
                { onclick : [] },
                { onfocus : [] }
            ]
        },
        name5: {
            name : "list_name",
            type : "text",
            value : [],
            options : [],
            fun : [
                { onclick : [] },
                { onfocus : [] }
            ]
        },
        type: {
            name : "list_type",
            type : "select",
            value : ['list', 'courses'],
            options : [
                { list : ['list'] },
                { courses : ['courses'] }
            ],
            fun : [
                { onclick : [] },
                { onfocus : [] }
            ]
        },
        permissions: {
            name : "list_permissions",
            type : "select",
            value : ['public', 'private', 'global', 'friends'],
            options : [
                { public : ['public'] },
                { private : ['private'] },
                { global : ['global'] },
                { friends : ['friends'] }
            ],
            fun : [
                { onclick : [] },
                { onfocus : [] }
            ]
        }
    }

    constructor(){ super() }

    showForm(module, type, data){
        data.icon = this.icon[type];
        this.show(module, type, data);
    }

    add(module, type, data) {
        data.fields = this.fields;
        this.showForm(module, type, data)
    }


}

class Words extends ModalWindow {
    constructor(){ super() }
    showForm(module, type, data){
        console.log('formformform', module, type);
        this.show(module, type, data);
    }
}

const validation = new ValidationClass();
const service = new Services();
const settings = new Settings();
const loadStatic = new Static();
const date = new ShowDate();
const calendar = new Calendar();
const modal = new ModalWindow();
const lists = new Lists();
const words = new Words();

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