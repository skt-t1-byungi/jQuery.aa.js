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
* [mariocasciaro/object-path](https://github.com/mariocasciaro/object-path)


useable via `$.EventEmitter`, `$.objectPath`.

---
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
$.aa.getData('object.example.1') // === 2
```

`$.aa`에서 제공하는 내부 데이터 객체는 하나 뿐(`glabal signletone`)입니다.

하나 뿐이니 중복이 발생하지 않도록 네임스페이스(`namespace`)를 잘 활용하는 것을 추천합니다.

`$.aa`는 [mariocasciaro/object-path](https://github.com/mariocasciaro/object-path)을 사용해서 `$.aa.setData`, `$.aa.getData`,`$.aa.hasData`를 제공합니다.


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

네임스페이스(`namespace`)를 잘 활용하는 것을 추천합니다.

`$.aa`는 기본적으로 [Olical/EventEmitter](https://github.com/Olical/EventEmitter)을 상속받아 확장(exntend) 구현되었습니다. 

EventEmitter의 모든 메소드들을 그대로 사용가능합니다.



### template(mustache)

#### 1 basic example

```html
<!-- name changes after 1 second.-->
<span aa-render="person">{{ name }}</span> 
<script>
    $.aa.setData('person', { name: 'john' });
    
    //render start, inside body. (recommend document object) 
    //just call it once.
    $('body').aa(); 
    
    setTimeout(function(){
        $.aa.setData('person.name', 'mina');

        // rerender start. 
        // parameter is [aa-render] value. 
        // if empty, run it all element.
        $.aa.render('person'); 
    }, 1000);
</script>
```
`[aa-render]`를 가진 태그 내부는 mustache 문법으로 작성하면 됩니다.

`[aa-render]` 속성값은 `$.aa.set`으로 넣은 data를 바라봅니다. 

여기선 $('body').aa() 전에 미리 person 데이터를 준비했기 때문에 바로 jonh이 출력되지만 $('body').aa() 후에 데이터를 주입했다면,

`$.aa.render`을 사용해서 템플릿을 갱신해야 합니다.


#### 2 event bind example

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

바인딩하고자 하는 `[aa-"eventName"]`으로 속성값을 작성하고  value에 `$.aa.on`으로 등록한 이벤트를 쓰면 됩니다. 

#### 3 multiple trigger, $event, $el
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


#### 4 mixed example
```html
<!--counter example-->
<section>
    <span aa-render="counter">hit: {{ hit }}</span>
    <button aa-click="increament">+</button>
    <button aa-click="decreament">-</button>
</section>

<script>
    $(document).aa();

    $.aa.setData('counter', {
        hit : 0
    });

    $.aa.render();

    $.aa.on('increament', function(){
        $.aa.setData('counter.hit', $.aa.getData('counter.hit') + 1);
        $.aa.render('counter.hit');
    });

    $.aa.on('decreament', function(){
        $.aa.setData('counter.hit', $.aa.getData('counter.hit') - 1);
        $.aa.render('counter.hit');
    });
</script>
```
카운트 예제입니다. `[aa-render]`와 `$.aa.render`의 인자값이 동일하지 않더라도 상관관계라면 갱신을 합니다.

#### 5 multiple data bind, helper

```html
<span aa-render="test _helper">
    1 is {{ #eval }} this.val === 1 ? 'true' : 'false' {{/eval}}
    2 is {{ #eval }} this.val === 2 ? 'true' : 'false' {{/eval}}
    3 is {{ #eval }} this.val === 3 ? 'true' : 'false' {{/eval}}
    4 is {{ #eval }} this.val === 4 ? 'true' : 'false' {{/eval}}
    5 is {{ #eval }} this.val === 5 ? 'true' : 'false' {{/eval}}
</span>
<script>
    $.aa.setData('test', { val: 3 });
    $(document).aa();
</script>

<!-- output :
 1 is false 2 is false 3 is true 4 is false 5 is false
-->
```
`[aa-render]`속성값을 공백을 통해 여러 데이터를 바인딩할 수도 있습니다. `e.g) [aa-render="data1.list data2.name"]` 

`_helper`는 `$.aa` 내부 데이터에 미리 mustache에 쓰기 적합한 헬퍼 함수를 정의한 객체입니다.

여러 데이터를 바인딩 할수 있는 점을 통해 데이터객체에 헬퍼함수를 작성하고 템플릿에 불러와 사용할 수 있습니다.

---
## problems

### not support nested.

```html
<!--not working-->
<div aa-render="data1">
    {{ name }}
    <span aa-render="data2">{{ key }}</span>
</div>
```
`[aa-render]` 안에 `[aa-render]`를 다시 사용할 수 없습니다. (날코딩용이니깐 너무 많은 것들을 기대하마쇼.)

최대한 aa-render 태그 크기를 작게 잡는 것을 추천합니다. `(<body aa-render="..">) is hell.`

```html
<!-- not good -->
<div aa-render="john">
    <div>
        <span>{{info.name}}</span>
        <span>{{info.age}}</span>
    </div>
    <div>
        <span>{{company.name}}</span>
        <span>{{company.location}}</span>
    </div>
</div>
<!--better-->
<div>
    <div aa-render="john.info">
        <span>{{name}}</span>
        <span>{{age}}</span>
    </div>
    <div aa-render="john.compay">
        <span>{{name}}</span>
        <span>{{location}}</span>
    </div>
</div>
```
(위에도 나쁘진 않은 것 같은데, 크기를 작게 잡는 것에 대한 예를 들기위해..)

### flicker

렌더링할때 aa-render 내부를 전부 바꾸기 때문에 깜박임이 존재할 수 있고, 기존 element를 모두 없애는 문제가 있다.

### solution

use modern framework(vue.js, react.js, angular.js..) -_-
