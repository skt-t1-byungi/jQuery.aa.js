//external
import $ from 'jquery';
import mustache from 'mustache';

//npm
import objectPath from 'object-path';
import EventEmitter from 'wolfy87-eventemitter';

//src
import API from 'API';
import EventAttrParser from 'Parser/EventAttr';
import definedEvents from 'var/definedEvents';
import eventHelpers from 'helpers/event';
import regeistredTemplates from 'var/regeistredTemplates';

//의존 라이브러리 jquery 내장
$.objectPath = objectPath;
$.EventEmitter = EventEmitter;

//aa api생성
const api = window.$$ = $.aa = new API();

//jquery
$.fn.aa = function(immediatelyRender = true) {
    const $templates = this.find('[aa-render]');

    //nested 구조 지원하지 않음.
    if ($templates.find('[aa-render]').length > 0) {
        console.error('not support nested [aa-rendoer]');
        return;
    }

    //이벤트 버블 바인딩
    definedEvents.forEach(evtName => {
        this.on(evtName, `[aa-${evtName}]`, event => {
            const $el = $(event.currentTarget);
            let parser = $el.data(`aa-${evtName}`);

            if (!parser) {
                const expr = $el.attr(`aa-${evtName}`);
                parser = new EventAttrParser($el, expr);
                $el.data(parser);
            }

            parser.parse(event).forEach((item) => {
                if (item.name in eventHelpers) {
                    eventHelpers[item.name].call($el, event, ...item.params);
                }

                api.trigger(item.name, item.params);
            });
        });
    });

    //템플릿 등록
    $templates.each((i, el) => {
        const $template = $(el);
        const listenDataPaths = $template.attr('aa-render').split(/\s+/);
        const templateHtml = $template.html();

        //pre parsing
        mustache.parse(templateHtml);
        regeistredTemplates.add($template, listenDataPaths, templateHtml);

        $template.addClass('_parsed');

        //template remove
        // $template.html('');
    });

    if (immediatelyRender) {
        api.render();
    }
};