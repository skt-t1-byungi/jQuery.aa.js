import $ from 'jquery';
import mustache from 'mustache';

import EventEmitter from 'EventEmitter';
import EventAttrParser from 'Parser/EventAttr';
import definedEvents from 'var/definedEvents';
import regeistredTemplates from 'var/regeistredTemplates';

const emitter = $.aa = new EventEmitter();

//렌더 함수 추가
emitter.render = function(dataPaths) {
    let templates;

    dataPaths = dataPaths.split(/\s+/);

    if (dataPaths.length > 0) {
        templates = regeistredTemplates.getByDataPath(...dataPaths);
    } else {
        templates = regeistredTemplates.getAll();
    }

    templates.forEach(({ $el, listenDataPaths, templateHtml }) => {
        let data = {};

        listenDataPaths.forEach(path => {
            $.extend(data, emitter.get(path));
        });

        const rendered = mustache.render(templateHtml, data);

        $el.html(rendered);
    });
};

//jquery
$.fn.aa = function(immediatelyRender = true) {
    const $tempaltes = this.find('[aa-render]');

    //nested 구조 지원하지 않음.
    if ($tempaltes.find('[aa-render]').length > 0) {
        console.error('not support nested [aa-rendoer]');
        return;
    }

    //이벤트 버블 바인딩
    definedEvents.forEach(evtName => {
        this.on(evtName, `[aa-${evtName}]`, event => {
            const $el = $(event.target);
            let parser = $el.data(`aa-${evtName}`);

            if (!parser) {
                const expr = $el.attr(`aa-${evtName}`);
                parser = new EventAttrParser($el, expr);
                $el.data(parser);
            }

            parser.parse(event).forEach((item) => {
                emitter.trigger(item.name, item.params);
            });
        });
    });

    //템플릿 등록
    $tempaltes.each(function() {
        const $template = $(this);
        const listenDataPaths = $template.attr('aa-render').split(/\s+/);
        const templateHtml = $template.html();

        //pre parsing
        mustache.parse(templateHtml);
        regeistredTemplates.add($template, listenDataPaths, templateHtml);

        //template remove
        $template.html('');
    });

    if (immediatelyRender) {
        emitter.render();
    }
};