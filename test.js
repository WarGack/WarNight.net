<script type="text/javascript">
    function redirect() {
    
        // Массив со ссылками
        var links = ['http://link1.ru', 'http://link2.ru','http://link3.ru', 'http://link4.ru'];
 
        // Получаем рандомный элемент...
        var rand = Math.floor(Math.random() * links.length);
 
        // ...и перенаправляем
        window.location = links[rand];
    }
 
    setTimeout(redirect, 9000);
</script>
