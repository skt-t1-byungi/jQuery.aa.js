import $ from 'jquery';

import EventEmitter from 'EventEmitter.js';
import EventAttrParser from 'Parser/EventAttr.js';
import definedEvents from 'var/definedEvents';

const emitter = $.aa = new EventEmitter();

$.aa.fn = function(immediatelyRender) {

    const $tempaltes = this.find('[aa-render]');

    //nested 구조 지원하지 않음.
    if ($tempaltes.find('[aa-render]').length > 0) {
        console.log('not support nested aa-rendoer!');
    }

    //이벤트 버블 바인딩
    definedEvents.forEach(evtName => {
        this.on(evtName, `[aa-${evtName}]`, event => {
            const $el = $(event.target);
            let parser = $el.data(`aa-${evtName}`);

            if (!parser) {
                const expr = $el.attr(`aa-${evtName}`);
                parser = new EventAttrParser(expr, $el, emitter);
                $el.data(parser);
            }

            parsed.trigger(event);
        });
    });

    //

};