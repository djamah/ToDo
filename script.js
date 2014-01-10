$(function(){
    var storage = window.localStorage;
    if(storage["taskList"]){
        $(".list").html(storage["taskList"]);
    }

    function saveList(){
       storage["taskList"] = $(".list").html();
    }

     function getDate(){ //было не удачное название, более уместно - "получитьДату" чем - "показатьДату"
        var d = new Date();
        var now = d.toString().slice(0,-14);//TODO: под виндой работает только в ие, а в фф и хроме - нет
        return now;
    }

    $(document).foundation();

    var $skn = $('#skn');//кешируем все обращения к списку, а то было то $('ul'), то $('#skn')

    $("#skin").click(function(){
        if($skn.hasClass("list")){
            $skn.removeClass("list");
            $skn.addClass("grid");
        }else{
            $skn.removeClass("grid");
            $skn.addClass("list");
        }
    });

    $skn.on("click", ".remove_task", function(){
        $(this).closest("li").fadeOut("slow", function(){
            $(this).remove();
            saveList();
        });
    });

    $skn.on("click", ".done", function(){
        var Task;
        var $this = $(this);
        if($this.hasClass("fi-checkbox")){
            $this.closest("li").removeClass("doneTask");

            $this.closest("li").children("h2").css("text-decoration", "none");//вообще говоря, писать цсс в джэс коде не лучшая идея, ну то есть для этой задачи ок, но вот если бы потом пришлось, скажем, еще и цвет менять, то код бы привращался в портянку, поэтому если появляется дополнительное изменение, то нужно это делать классами
            $this.closest("li").children("p").css("text-decoration", "none");
            $this.closest("li").fadeOut('slow', function(){
                //внимание! this - уже другой
                Task = $(this).closest("li").detach();
                Task.prependTo($skn);

                $(this).find(".edit_task").show();

                $this.removeClass("fi-checkbox");//а тут мы обращаемся к зису который уровнем выше, который мы кешировали
                $this.addClass("fi-check");

                Task.fadeIn('slow', saveList);
            });
        }else{
            $this.closest("li").addClass("doneTask");

            $this.closest("li").children("h2").css("text-decoration", "line-through");
            $this.closest("li").children("p").css("text-decoration", "line-through");

            $this.closest("li").fadeOut('slow', function(){
                Task = $(this).closest("li").detach();
                Task.appendTo($skn);

                $(this).find(".edit_task").hide();

                $this.removeClass("fi-check");
                $this.addClass("fi-checkbox");

                Task.fadeIn('slow', function(){
                    hideDoneTask();
                    saveList();
                });
            });
        }
    });

    $("[type='submit']").click(function(){
        var titleText = $("#title").val();
        var descriptionText = $("#description").val();
        var newEl = "<li><h2>"+titleText+"</h2><div><span class='date_time'>"+getDate()+"</span><br/><i class='fi-check done'></i><i class='fi-pencil edit_task'></i><i class='fi-x remove_task'></i></div><p>"+descriptionText+"</p></li>";
        $skn.prepend(newEl);
        $("#title").val('');
        $("#description").val('');
        $("#myModal").foundation("reveal","close");
        saveList();
    });

    $("#showDone").click(changeShowDone);

    function changeShowDone(){
        var $this = $(this);//кешируем
        if($this.text() == "Hide done task"){
            $this.text("Show done task");
        }else{
            $this.text("Hide done task");
        }
        hideDoneTask();
    }
    function hideDoneTask(){
        if($('#showDone').text() == "Show done task"){
            if($("li").hasClass('doneTask'))
                $('ul').find('.doneTask').fadeOut();
        }else{
            $('ul').find('.doneTask').fadeIn();
        }
    }

    $skn.on("click", ".edit_task", function(){
        var $this = $(this);//кешируем
        if($this.hasClass("fi-pencil")){
            $this.closest("div").find(".done").hide();//нет смысла удалять, если мы будем его показывать

            $this.removeClass("fi-pencil");
            $this.addClass("fi-clipboard-pencil");

            $this.closest("li").addClass("edit");

            var h2Text = $(this).closest("li").find("h2").text();
            var pText = $(this).closest("li").find("p").text();

            $this.closest("li").find("h2")//ничего не нужно отдельно удалять а потом добавлять, лучше заменять
                .replaceWith("<textarea class='title_area' cols='' rows='2'>"+h2Text+"</textarea>");

            $this.closest("li").find("p")
                .replaceWith("<textarea class='description_area' cols='' rows='5'>"+pText+"</textarea>");
        }else{
            var titleText = $(this).closest("li").find(".title_area").val();
            var descriptionText = $(this).closest("li").find(".description_area").val();

            $this.closest("li").find(".title_area")// нет смысла создавать новый елемент
                .replaceWith("<h2>"+titleText+"</h2>");
            $this.closest("li").find(".description_area")
                .replaceWith("<p>"+descriptionText+"</p>");
            $this.closest("li").find(".date_time").text(getDate());


            $this.closest("div").find(".done").show();

            $this.addClass("fi-pencil");
            $this.removeClass("fi-clipboard-pencil");

        }
        saveList();
    });
})
