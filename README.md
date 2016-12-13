# jQuery.aa.js

simple view plugin by jquery, mustache

## why?

* can not abandon jquery.
* backbone is good, but slow work.

최신 프레임웍을 쓰고 싶지만 현실상 어렵고, jquery를 버릴 수 없음. 

백본은 훌륭한 대안이지만 코드가 장황해져서 날코딩에 비해 작업속도가 느려짐.

jquery를 사용하면서 백본보다는 코드가 구려져도 좀더 빠른 코딩이 되는, 중간타협지점이 없을까해서 맹들어봄.


## dependent

* [jquery.js](https://github.com/jquery/jquery)
* [mustache.js](https://github.com/janl/mustache.js)

#### (injected)

* [Olical/EventEmitter](https://github.com/Olical/EventEmitter)
* [dot-notes-js](https://github.com/zackehh/dot-notes-js)


useable via `$.EventEmitter`, `$.dots`.

## used

### data

```js
//data set method
$.aa.setData('key', 'val');

//data get method
$.aa.getData('key'); // === 'val'

//used object param
$.aa.setData({
    'object' : {
        example: [1, 2]
    }
});

//used dot notation
$.aa.getData('object.example[1]') // === 2
```

`$.aa`에서 제공하는 내부 데이터 객체는 하나 뿐(`glabal signletone`)입니다.

네임스페이스(`namespace`)를 잘 활용하는 것을 추천함.


### event
```js
// register listener
$.aa.on('openMessage', function(message){
    alert(message); 
})

// fire listeners
$.aa.emit('openMessage', '!');

//used object param
$.aa.on({
    openMessage : function(message){
        console.log(message);
    },
    openMessageByPrompt : function(message){
        $.aa.emit('openMessage', prompt(message));
    }
});
```
역시 제공하는 이벤트 객체는 하나 뿐(`glabal signletone`)입니다.

네임스페이스(`namespace`)를 잘화용하는 것을 추천합니다.


### template(mustache) render

#### basic example

name changes after 1 second.

```html
<span aa-render="person">{{ name }}</span> <!-- output, john -->

<script>
    $.aa.setData('person', { name: 'john' });
    
    //render start, inside body tag. recommend document object. just call it once.
    $('body').aa(); 
    
    setTimeout(function(){
        $.aa.setData('person.name', 'mina');
        $.aa.render('person'); // rerender start. parameter is [aa-render] value. if empty, run it all element.
    }, 1000);
</script>
```
`[aa-render]`를 가진 element태그의 innerHtml은 mustache의 template html로 사용됩니다. 따라서 mustache 문법으로 작성하면 됩니다.

`[aa-render]` 값은 $.aa의 data를 바라봅니다.


#### event bind example

```html
<button aa-click="openMessage('hi')">click</button>
<script>
    $(document).aa(); 
    
    $.aa.on('openMessage', function(message){
        alert(message); 
    })
</script>
```
button을 click하면 "hi"내용이 담긴 alert창이 뜹니다.

바인딩하고자 하는 `[aa-"eventName"]`으로 attribute을 작성하고  value에 `$.aa.on`으로 등록한 이벤트를 쓰면 됩니다. 

#### multi event, $event, $el
```html
<button aa-click="test1, test2($el, $event)">click</button>
<script>
    $(document).aa(); 
    
    $.aa.on({
        test1: function(){
            console.log('test1');
        },
        test2: function($btn, $event){
            console.log($btn === $('button')); // true
        }
    })
</script>
```
`,`을 통해 여러 이벤트를 실행할 수 있습니다. 인자가 없으면 `()`을 생락할 수도 있구요.

`$el`, `$event`을 통해 jquery element, jquery event 객체를 전달 받을 수 있습니다.


#### mixed example
```html
```

