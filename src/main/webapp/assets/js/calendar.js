$(function () {
    $("#headLeft").on("click", function () {
        location.href="/page/calendar";
    })
    // 큰 캘린더 만들기
    let input = document.querySelectorAll(".date");
    for(let i=0;i<42;i++){
        let month = months[i];
        let item = input.item(i);
        item.dataset.value = month;
        if(item.dataset.value != nowMonth ){
            item.style.color = "#ccc";
        }
        if(item.dataset.value < nowMonth ){
            $(".date").eq(i).html("<a class='preMonth'>"+dates[i]+"</a>");
            $(".miniDate").eq(i).html("<span class='miniPreMonth'>"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartPreMonth'>"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndPreMonth'>"+dates[i]+"</span>");
        }else if(item.dataset.value > nowMonth){
            $(".date").eq(i).html("<a class='nextMonth'>"+dates[i]+"</a>");
            $(".miniDate").eq(i).html("<span class='miniNextMonth'>"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartNextMonth'>"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndNextMonth'>"+dates[i]+"</span>");
        }else{
            $(".date").eq(i).html("<a class='link' >"+dates[i]+"</a>");
            $(".miniDate").eq(i).html("<span class='miniLink' >"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartLink' >"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndLink' >"+dates[i]+"</span>");
        }

        $(".preMonth").attr("href","/page/changeCal?month="+(nowMonth-1)+"&year="+nowYear).css("color","#ccc").css("textDecoration","none").css("position","absolute").css("top","10px").css("left","10px");
        $(".nextMonth").attr("href","/page/changeCal?month="+(nowMonth+1)+"&year="+nowYear).css("color","#ccc").css("textDecoration","none").css("position","absolute").css("top","10px").css("left","10px");
        $(".link").css("cursor","pointer").css("position","absolute").css("top","10px").css("left","10px");

        $(".miniPreMonth").css("color","#ccc");
        $(".miniNextMonth").css("color","#ccc");

        $(".miniStartPreMonth").css("color","#ccc");
        $(".miniStartNextMonth").css("color","#ccc");
        $(".miniStartLink").css("cursor","pointer");

        $(".miniEndPreMonth").css("color","#ccc");
        $(".miniEndNextMonth").css("color","#ccc");
        $(".miniEndLink").css("cursor","pointer");
    }

    //일정 등록 버튼
    $("#btnSchedule").on("click", function () {

        $("#list").css("display", "inline");
        $("#showStartDate").css("display", "inline");
        $("#showEndDate").css("display", "inline");

        let today = new Date();
        let selMonth = today.getMonth()+1;
        let selDate = today.getDate();

        $("#startDate").val(nowYear+". "+selMonth+". "+selDate);
        $("#endDate").val(nowYear+". "+selMonth+". "+selDate);
    });

    // 작은 달력 좌, 우 화살표
    $("#miniArrowLeft").on("click", function () {
        let year = $("#miniYear").text();
        let month;
        if(Number($("#miniMonth").text()) == 1){
            month = 12;
            $("#miniMonth").text(month);
            year = Number($("#miniYear").text())-1;
            $("#miniYear").text(year);
        }else{
            month = Number($("#miniMonth").text())-1;
        }
        $("#miniMonth").text(month);

        $.ajax({
            url:"/cal/"+year+"/"+month,
            type:"get",
            data: "json",
            success: function(res){
                for(let i=0;i<42;i++){

                    if(res[i].month < month ){
                        $(".miniDate").eq(i).html("<span class='miniPreMonth'>"+res[i].date+"</span>");
                    }else if(res[i].month > month){
                        $(".miniDate").eq(i).html("<span class='miniNextMonth'>"+res[i].date+"</span>");
                    }
                    else{
                        $(".miniDate").eq(i).html("<span class='miniLink' >"+res[i].date+"</span>");
                    }

                    $(".miniPreMonth").css("color","#ccc");
                    $(".miniNextMonth").css("color","#ccc");
                }
            }
        })
    })

    $("#miniArrowRight").on("click", function () {
        let year = $("#miniYear").text();
        let month;
        if(Number($("#miniMonth").text()) == 12){
            month = 1;
            $("#miniMonth").text(month);
            year = Number($("#miniYear").text())+1;
            $("#miniYear").text(year);
        }else{
            month = Number($("#miniMonth").text())+1;
        }
        $("#miniMonth").text(month);

        $.ajax({
            url:"/cal/"+year+"/"+month,
            type:"get",
            data: "json",
            success: function(res){
                for(let i=0;i<42;i++){

                    if(res[i].month < month ){
                        $(".miniDate").eq(i).html("<span class='miniPreMonth'>"+res[i].date+"</span>");
                    }else if(res[i].month > month){
                        $(".miniDate").eq(i).html("<span class='miniNextMonth'>"+res[i].date+"</span>");
                    }
                    else{
                        $(".miniDate").eq(i).html("<span class='miniLink' >"+res[i].date+"</span>");
                    }

                    $(".miniPreMonth").css("color","#ccc");
                    $(".miniNextMonth").css("color","#ccc");
                }
            }
        })
    })

    //캘린더 만들기
    $("#addCalendar").on("click", function () {
        $("#newCalendar").css("display","inline");
    })

    // 캘린더 색상 변경 클릭시
    $("#selColor").on("click", function () {
        $("#displayControl").css("display","inline");
    })

    // 캘린더 색상 선택시
    $(".circleColor").on("click", function () {
        let url = $(this).attr("src");
        let cutUrlPoint = url.lastIndexOf("_")+1;
        let cutUrl = url.slice(0, cutUrlPoint);

        for(let i=0;i<15;i++){
            let circle = $(".circleColor").eq(i).attr("src");
            let point = circle.lastIndexOf("_")+1;
            let checkCircle = circle.slice(point);
            if(checkCircle == "checked.png"){
                let changeUrl = circle.slice(0, point);
                $(".circleColor").eq(i).attr("src", changeUrl+"uncheck.png");
            }
        }
        $(this).attr("src", cutUrl+"checked.png");
        $("#displayControl").css("display","none");
        $("#nowCalColor").attr("src", cutUrl+"uncheck.png");
    })

    // 캘린더 참여자 선택시 캘린더 참여자 박스에 추가되는 기능
    $("#empName").on("change", function () {
        if($(this).val() != "사원명"){
            $(".selectedEmpName").append("<div class=\"overEmpName\">\n" +
                "                            <span>"+$(this).val()+"</span>\n" +
                "                            <input type=\"button\" value=\"X\" class=\"btnDelEmpName\">\n" +
                "                        </div>");
        }
    })

    // 캘린더 참여자 마우스 오버시 삭제 버튼 보이기/감추기
    $(document).on("mouseover",".overEmpName",function(){
        $(this).children(".btnDelEmpName").css("visibility", "visible");
    })
    $(document).on("mouseout",".overEmpName",function(){
        $(this).children(".btnDelEmpName").css("visibility", "hidden");
    })

    //캘린더 참여자 선택 삭제시
    $(document).on("click",".btnDelEmpName",function(){
        $(this).parent().remove();
    })

    //캘린더 만들기 취소 버튼 클릭시
    $("#btnCancelNewCal").on("click", function () {
        $("#nowCalColor").attr("src","/assets/images/color1_circle_uncheck.png");
        for(let i=0;i<15;i++){
            let circle = $(".circleColor").eq(i).attr("src");
            let point = circle.lastIndexOf("_")+1;
            let checkCircle = circle.slice(point);
            if(checkCircle == "checked.png"){
                let changeUrl = circle.slice(0, point);
                $(".circleColor").eq(i).attr("src", changeUrl+"uncheck.png");
            }
        }
        $(".circleColor").eq(0).attr("src", "/assets/images/color1_circle_checked.png");
        $("#calendarName").val("");
        $("#empName").prop('selectedIndex',0);
        $("#participantsBox").html("<div class=\"selectedEmpName\"></div>");
        $("#newCalendar").css("display","none");
    })

    //내 캘린더 숨기기, 보이기
    let slideUpAndDownFlag = 0;
    $("#upAndDownBox").on("click", function () {
        if(slideUpAndDownFlag == 0){
            $("#myCalendars").slideUp();
            slideUpAndDownFlag = 1;
            $("#upAndDownBox").attr("src","/assets/images/arrow_down.png");
        }else{
            $("#myCalendars").slideDown();
            slideUpAndDownFlag = 0;
            $("#upAndDownBox").attr("src","/assets/images/arrow_up.png");
        }
    })

    //큰 캘린더 이전 달 날짜 클릭시
    $(".preMonth").parent().on("click",function () {
        $(this).children().get(0).click();
    })

    //큰 캘린더 다음 달 날짜 클릭시
    $(".nextMonth").parent().on("click",function () {
        $(this).children().get(0).click();
    })

    //큰 캘린더 날짜 클릭시
    $(".link").parent().on("click",function () {

        $("#list").css("display", "inline");
        $("#showStartDate").css("display", "inline");
        $("#showEndDate").css("display", "inline");

        let selMonth = nowMonth;
        let selDate = $(this).text();

        $("#startDate").val(nowYear+". "+nowMonth+". "+selDate);
        $("#endDate").val(nowYear+". "+nowMonth+". "+selDate);
    })

    //일정 등록 날짜 클릭시
    $("#showStartDate").on("click", function () {
        let startMiniYear = $("#startDate").val().slice(0, 4);
        let startMiniMonth = $("#startDate").val().slice(5, $("#startDate").val().lastIndexOf("."));
        let elementId = "startCal";
        $("#startMiniYear").text(startMiniYear);
        $("#startMiniMonth").text(startMiniMonth);
        changeMiniCalendar(startMiniYear, startMiniMonth, elementId);

        $(".selStartDate").css("display", "inline");
        $(".selEndDate").css("display", "none");
    });
    $("#showEndDate").on("click", function () {
        let endMiniYear = $("#endDate").val().slice(0, 4);
        let endMiniMonth = $("#endDate").val().slice(5, $("#endDate").val().lastIndexOf("."));
        let elementId = "endCal";
        $("#endMiniYear").text(endMiniYear);
        $("#endMiniMonth").text(endMiniMonth);
        changeMiniCalendar(endMiniYear, endMiniMonth, elementId);

        $(".selEndDate").css("display", "inline");
        $(".selStartDate").css("display", "none");
    });

    //일정 등록 아무곳이나 클릭시 일정 등록 날짜 사라짐
    $('#list').on('click', function(e) {
        if(!$(e.target).hasClass("selStartDate")) {
            $(".selStartDate").css("display", "none");
        }
        if(!$(e.target).hasClass("selStartDate")) {
            $(".selEndDate").css("display", "none");
        }
    });

    // 일정 시작날짜 선택 달력 좌, 우 화살표
    $(".startMiniArrows").on("click", function () {
        let year = Number($("#startMiniYear").text());
        let month = Number($("#startMiniMonth").text());
        let elementId = $(this).attr('id');
        changeMiniCalendar(year, month, elementId);
    })

    // 일정 시작날짜 달력에서 일자 클릭시
    $(".miniStartDate").on("click", function () {
        let newMonth = $(this).children(".hiddenStartMonth").val();
        let newDate = $(this).text();
        $("#startDate").val($("#startDate").val().slice(0, 5)+" "+newMonth+". "+newDate);
        $("#endDate").val($("#startDate").val().slice(0, 5)+" "+newMonth+". "+newDate);
        $(".selStartDate").css("display", "none");
    })

    // 일정 종료날짜 선택 달력 좌, 우 화살표
    $(".endMiniArrows").on("click", function () {
        let year = Number($("#endMiniYear").text());
        let month = Number($("#endMiniMonth").text());
        let elementId = $(this).attr('id');
        // changeMiniCalendar(year, month, elementId);
    })

    // 일정 종료날짜 달력에서 일자 클릭시
    $(".miniEndDate").on("click", function () {
        let newMonth = $(this).children(".hiddenEndMonth").val();
        let newDate = $(this).text();
        $("#endDate").val($("#endDate").val().slice(0, 5)+" "+newMonth+". "+newDate);
        $(".selEndDate").css("display", "none");
    })

    //일정 등록 팝업창에서 하루종일 체크시
    $("#chkOneDay").on("click", function () {
        if($("#chkOneDay").is(":checked") == true){
            $("#startDate").css("width","209px");
            $("#showStartDate").css("width","221px");
            $("#startTime").css("display","none");
            $("#endDate").css("width","209px");
            $("#showEndDate").css("width","221px");
            $("#endTime").css("display","none");
        }else{
            $("#startDate").css("width","100px");
            $("#showStartDate").css("width","100px");
            $("#startTime").css("display","inline");
            $("#endDate").css("width","100px");
            $("#showEndDate").css("width","100px");
            $("#endTime").css("display","inline");
        }
    })

    // 일정 참여자 선택시 일정 참여자 박스에 추가되는 기능
    $("#todoEmpName").on("change", function () {
        if($(this).val() != "사원명"){
            $(".todoPaticipantsBox").append("<div class=\"overTodoEmpName\">\n" +
                "                            <span>"+$(this).val()+"</span>\n" +
                "                            <input type=\"button\" value=\"X\" class=\"btnDelTodoEmpName\">\n" +
                "                        </div>");
        }
    })

    // 일정 참여자 마우스 오버시 삭제 버튼 보이기/감추기
    $(document).on("mouseover",".overTodoEmpName",function(){
        $(this).children(".btnDelTodoEmpName").css("visibility", "visible");
    })
    $(document).on("mouseout",".overTodoEmpName",function(){
        $(this).children(".btnDelTodoEmpName").css("visibility", "hidden");
    })

    //일정 참여자 선택 삭제시
    $(document).on("click",".btnDelTodoEmpName",function(){
        $(this).parent().remove();
    })

    //일정 등록 추가하기 버튼 클릭시



    //일정 등록 취소 버튼 클릭시
    $(document).on("click","#btnCancel",function(){
        $("#todoEmpName").prop('selectedIndex',0);
        $("#selCalendar").prop('selectedIndex',0);
        $("#repeat").prop('selectedIndex',0);
        $("#alarm").prop('selectedIndex',0);
        $("#todoLocation").val("");
        $("#todoExplain").val("");
        $(".todoPaticipantsBox").html("");
        $("#list").css("display", "none");
    });


    // $("#btnAdd").on("click", function () {
    //     if($("#btnAdd").val() == "추가하기"){
    //         let tContent = $("#inpAdd").val();
    //         if(tContent == ""){
    //             alert("할일을 작성해주세요.");
    //             return false;
    //         }
    //         let tIndex = 0;
    //         for(let i=0;i<$(".hide").length+1;i++){
    //             tIndex = i;
    //         }
    //         let json = JSON.stringify({"tMonth":tMonth, "tDate":tDate, "tContent":tContent, "tIndex":tIndex});
    //         $.ajax({
    //             url:"/todo/todoRegister/",
    //             type:"post",
    //             headers: {"Content-Type":"application/json"},
    //             data: json,
    //             dataType : "text",
    //             success: function(res){
    //                 // getList(tMonth, tDate);
    //             }
    //         })
    //         $("#inpAdd").val("");
    //     }else{
    //         let yesOrNo = confirm("수정하시겠습니까?");
    //         if(yesOrNo == true){
    //             let tContent = $("#inpAdd").val();
    //             let tIndex = $("#hideIndex").val();
    //
    //             let json = JSON.stringify({"tMonth":tMonth, "tDate":tDate, "tContent":tContent, "tIndex":tIndex});
    //             $.ajax({
    //                 url:"/todo/todoModify/",
    //                 type:"put",
    //                 headers: {"Content-Type":"application/json"},
    //                 data: json,
    //                 dataType : "text",
    //                 success: function(res){
    //                     // getList(tMonth, tDate);
    //                 }
    //             })
    //             $("#btnCancel").trigger("click");
    //             $("#inpAdd").val("");
    //         }
    //     }
    // })

    // $(document).on("click",".btnMod",function(){
    //
    //     let index = $(".btnMod").index(this);
    //     $("#hideIndex").val(index);
    //     let tContent = $(".content").eq(index).val();
    //     $("#inpAdd").val(tContent);
    //     $("#btnAdd").val("수정");
    //     $("#btnAdd").css("width", "47px");
    //     if($("#btnCancel").val() != "취소"){
    //         $("#inputs").append("<input type='button' value='취소' id='btnCancel' " +
    //             "style='    width: 47px;\n" +
    //             "    height: 34px;\n" +
    //             "    background: #ff0000;\n" +
    //             "    color: white;\n" +
    //             "    font-weight: bold;\n" +
    //             "    border: 1px;\n" +
    //             "    border-radius: 5px;'>");
    //     }
    // });

    // $(document).on("click",".btnDel",function(){
    //     let yesOrNo = confirm("삭제하시겠습니까?");
    //     if(yesOrNo == true){
    //         let index = $(".btnDel").index(this);
    //         let tContent = $(".content").eq(index).val();
    //
    //         let json = JSON.stringify({"tMonth":tMonth, "tDate":tDate, "tContent":tContent});
    //         $.ajax({
    //             url:"/todo/todoRemove/",
    //             type:"delete",
    //             headers: {"Content-Type":"application/json"},
    //             data: json,
    //             dataType : "text",
    //             success: function(res){
    //                 // getList(tMonth, tDate);
    //             }
    //         })
    //     }
    // });

    // $(document).on("click","input[name='chkTodo']",function(){
    //     let tIndex = $(".chkTodo").index(this);
    //     if($(".chkTodo").eq(tIndex).is(":checked") == false){
    //         let tContent = $(".content").eq(tIndex).val();
    //
    //         let json = JSON.stringify({"tMonth":tMonth, "tDate":tDate, "tContent":tContent});
    //         $.ajax({
    //             url:"/todo/todoNoCheck/",
    //             type:"put",
    //             headers: {"Content-Type":"application/json"},
    //             data: json,
    //             dataType : "text",
    //             success: function(res){
    //                 // getList(tMonth, tDate);
    //             }
    //         })
    //     }else{
    //         let tContent = $(".content").eq(tIndex).val();
    //
    //         let json = JSON.stringify({"tMonth":tMonth, "tDate":tDate, "tContent":tContent});
    //         $.ajax({
    //             url:"/todo/todoCheck/",
    //             type:"put",
    //             headers: {"Content-Type":"application/json"},
    //             data: json,
    //             dataType : "text",
    //             success: function(res){
    //                 // getList(tMonth, tDate);
    //             }
    //         })
    //     }
    // });
});

function changeMiniCalendar(year, month, elementId) {
    if(elementId == 'startMiniArrowLeft'){
        if(month == 1){
            month = 12;
            $("#startMiniMonth").text(month);
            year = year-1;
            $("#startMiniYear").text(year);
        }else{
            month = Number($("#startMiniMonth").text())-1;
            $("#startMiniMonth").text(month);
        }
    }else if(elementId == 'startMiniArrowRight'){
        if(month == 12){
            month = 1;
            $("#startMiniMonth").text(month);
            year = year+1;
            $("#startMiniYear").text(year);
        }else{
            month = Number($("#startMiniMonth").text())+1;
            $("#startMiniMonth").text(month);
        }
    }else if (elementId == 'endMiniArrowLeft'){
        if(month == 1){
            month = 12;
            $("#endMiniMonth").text(month);
            year = year-1;
            $("#endMiniYear").text(year);
        }else{
            month = Number($("#endMiniMonth").text())-1;
            $("#endMiniMonth").text(month);
        }
    }else if(elementId == 'endMiniArrowRight'){
        if(month == 12){
            month = 1;
            $("#endMiniMonth").text(month);
            year = year+1;
            $("#endMiniYear").text(year);
        }else{
            month = Number($("#endMiniMonth").text())+1;
            $("#endMiniMonth").text(month);
        }
    }
    if(elementId == 'startMiniArrowLeft'||elementId == 'startMiniArrowRight'||elementId=='startCal'){
        $.ajax({
            url:"/cal/"+year+"/"+month,
            type:"get",
            data: "json",
            success: function(res){
                for(let i=0;i<42;i++){

                    if(res[i].month < month ){
                        $(".miniStartDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenStartMonth'>" +
                            "<span class='miniStartPreMonth'>"+res[i].date+"</span>");
                    }else if(res[i].month > month){
                        $(".miniStartDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenStartMonth'>" +
                            "<span class='miniStartNextMonth'>"+res[i].date+"</span>");
                    }else{
                        $(".miniStartDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenStartMonth'>" +
                            "<span class='miniStartLink' >"+res[i].date+"</span>");
                    }

                    $(".miniStartPreMonth").css("color","#ccc").css("cursor","pointer");
                    $(".miniStartNextMonth").css("color","#ccc").css("cursor","pointer");
                    $(".miniStartLink").css("cursor","pointer");
                }
            }
        })
    }else if(elementId == 'endMiniArrowLeft'|| elementId == 'endMiniArrowRight'||elementId=='endCal'){
        $.ajax({
            url:"/cal/"+year+"/"+month,
            type:"get",
            data: "json",
            success: function(res){
                for(let i=0;i<42;i++){

                    if(res[i].month < month ){
                        $(".miniEndDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenEndMonth'>" +
                            "<span class='miniEndPreMonth'>"+res[i].date+"</span>");
                    }else if(res[i].month > month){
                        $(".miniEndDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenEndMonth'>" +
                            "<span class='miniEndNextMonth'>"+res[i].date+"</span>");
                    }else{
                        $(".miniEndDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenEndMonth'>" +
                            "<span class='miniEndLink' >"+res[i].date+"</span>");
                    }

                    $(".miniEndPreMonth").css("color","#ccc").css("cursor","pointer");
                    $(".miniEndNextMonth").css("color","#ccc").css("cursor","pointer");
                    $(".miniEndLink").css("cursor","pointer");
                }
            }
        })
    }


}
// function getList(tMonth, tDate) {
//     $.ajax({
//         url: "/todo/"+tMonth+"/"+tDate,
//         type: "get",
//         data: "json",
//         success:function(res){
//             $("#todoList").html("<div class='todo'>");
//             for(let i=0;i<res.length;i++) {
//                 if(res[i].tChk == 1){
//                     $(".todo").append("<input type='checkbox' class='chkTodo' name='chkTodo' checked>" +
//                         "<input type=\"text\" class=\"content\" value="+"'"+res[i].tContent+"'"+" readonly style=\"text-decoration: line-through\">");
//                 }else{
//                     $(".todo").append("<input type='checkbox' class='chkTodo' name='chkTodo'>" +
//                         "<input type=\"text\" class=\"content\" value="+"'"+res[i].tContent+"'"+" readonly>");
//                 }
//                 $(".todo").append("<input type='button' class=\"btnMod\" style=\"cursor: pointer\">" +
//                     "<input type='button' class=\"btnDel\" style=\"cursor: pointer\">" +
//                     "<input type='hidden' value="+"'"+i+"'"+" class='hide'>"+
//                     "</div>");
//             }
//         }
//     })
// }