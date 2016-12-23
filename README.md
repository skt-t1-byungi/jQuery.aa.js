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

```html
<h1 aa-render="page">
    {{title}}
</h1>

<ul aa-render="page">
    {{#items}}
    <li>{{.}}</li>
    {{/items}}
</ul>

<form aa-submit="@prevent, addItem($el)">
    <input type="text" name="text">
    <button type="submit" aa-render="page">Add # {{nextNumber}}</button>
</form>

<script>
    $$.set('page', {
        'title' : 'Hello!',
        'items' : [],
        'nextNumber' : function(){
            return this.items.length + 1;
        }
    });

    $$.on('addItem', function($el){
        var text =  $el.find('[name=text]').val();
        
        $$.modify('page.items', function(items){
            items.push(text);
            return items;
        });

        $$.render('page.items');
    });

    $$.start();

</script>
```
[view demo](https://jsfiddle.net/rLy6u2b5/)