$(function(){
    var storage = window.localStorage;
    if(storage["taskList"]){
        $(".list").html(storage["taskList"]);
    }

    function saveList(){
       storage["taskList"] = $(".list").html();
    }

     function showDate(){
        var d = new Date();
        var now = d.toString().slice(0,-14);
         return now;
    }

    $(document).foundation();
    $("#skin").click(function(){
        if($("#skn").hasClass("list")){
            $("#skn").removeClass("list");
            $("#skn").addClass("grid");
        }else{
            $("#skn").removeClass("grid");
            $("#skn").addClass("list");
        }
    });

    $("ul").on("click", ".remove_task", function(){
        $(this).closest("li").fadeOut("slow", function(){
            $(this).remove();
            saveList();
        });
    });

    $("ul").on("click", ".done", function(){
        var Task;
        if($(this).hasClass("fi-checkbox")){
            $(this).closest("li").removeClass("doneTask");
            $(this).closest("li").children("h2").css("text-decoration", "none");
            $(this).closest("li").children("p").css("text-decoration", "none");
            $(this).closest("li").fadeOut('slow', function(){
                Task = $(this).closest("li").detach();
                Task.prependTo("ul");
                $(this).find(".edit_task").show();
                $(this).find(".done").removeClass("fi-checkbox");
                $(this).find(".done").addClass("fi-check");
                $(this).find(".edit_text").show();
                Task.fadeIn('slow', saveList);
            });
        }else{
            $(this).closest("li").addClass("doneTask");
            $(this).closest("li").children("h2").css("text-decoration", "line-through");
            $(this).closest("li").children("p").css("text-decoration", "line-through");
            $(this).closest("li").fadeOut('slow', function(){
                Task = $(this).closest("li").detach();
                Task.appendTo("ul");
                $(this).find(".done").removeClass("fi-check");
                $(this).find(".done").addClass("fi-checkbox");
                $(this).find(".edit_task").hide();
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
        var newEl = "<li><h2>"+titleText+"</h2><div><span class='date_time'>"+showDate()+"</span><br/><i class='fi-check done'></i><i class='fi-pencil edit_task'></i><i class='fi-x remove_task'></i></div><p>"+descriptionText+"</p></li>";
        $("#skn").prepend(newEl);
        $("#title").val('');
        $("#description").val('');
        $("#myModal").foundation("reveal","close");
        saveList();
    });

    $("#showDone").click(changeShowDone);

    function changeShowDone(){
        if($(this).text() == "Hide done task"){
            $(this).text("Show done task");
        }else{
            $(this).text("Hide done task");
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

    $("ul").on("click", ".edit_task", function(){
        if($(this).hasClass("fi-pencil")){
            $(this).closest("div").find(".done").remove();
            $(this).removeClass("fi-pencil");
            $(this).addClass("fi-clipboard-pencil");
            $(this).closest("li").addClass("edit");

            var h2Text = $(this).closest("li").find("h2").text();
            var pText = $(this).closest("li").find("p").text();
            $(this).closest("li").find("h2").remove();
            $(this).closest("li").find("p").remove();
            $(this).closest("li").prepend("<textarea class='title_area' cols='' rows='2'>"+h2Text+"</textarea>");
            $(this).closest("li").append("<textarea class='description_area' cols='' rows='5'>"+pText+"</textarea>");
        }else{
            var titleText = $(this).closest("li").find(".title_area").val();
            var descriptionText = $(this).closest("li").find(".description_area").val();
            var newEl = "<li><h2>"+titleText+"</h2><div><span class='date_time'>"+showDate()+"</span><br/><i class='fi-check done'></i><i class='fi-pencil edit_task'></i><i class='fi-x remove_task'></i></div><p>"+descriptionText+"</p></li>";
            $("ul").prepend(newEl);
            $("ul").children(".edit").remove();
        }
        saveList();
    });
})
