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