$(function () {
    //알림 권한 요청
    getNotificationPermission();

    // 알림기능을 위한 실시간 시간출력 함수
    startTime();

    // 헤드의 너울캘린더 클릭시
    $("#headLeft").on("click", function () {
        let now = new Date();
        let month = now.getMonth()+1
        location.href="/page/calendar?empId="+auth+"&year="+nowYear+"&month="+(month);
    })

    // 큰 캘린더 만들기
    let input = document.querySelectorAll(".date");
    let now = new Date();
    let todayMonth = now.getMonth()+1;
    let today = now.getDate();

    for(let i=0;i<42;i++){
        let month = months[i];
        let item = input.item(i);
        item.dataset.value = month;
        if(item.dataset.value != nowMonth ){
            item.style.color = "#ccc";
        }
        if(item.dataset.value < nowMonth ){
            $(".date").eq(i).html("<a class='preMonth fontGray datePosition decoNone'>"+dates[i]+"</a>");
            $(".miniDate").eq(i).html("<span class='miniPreMonth fontGray'>"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartPreMonth fontGray'>"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndPreMonth fontGray'>"+dates[i]+"</span>");
        }else if(item.dataset.value > nowMonth){
            $(".date").eq(i).html("<a class='nextMonth fontGray datePosition decoNone'>"+dates[i]+"</a>");
            $(".miniDate").eq(i).html("<span class='miniNextMonth fontGray'>"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartNextMonth fontGray'>"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndNextMonth fontGray'>"+dates[i]+"</span>");
        }else{
            $(".date").eq(i).html("<a class='link pointer datePosition' >"+dates[i]+"</a>");
            if(nowMonth == todayMonth && dates[i] == today){
                $(".date").eq(i).html("<a class='link pointer datePosition' id='today' >"+dates[i]+"</a>");
            }
            $(".miniDate").eq(i).html("<span class='miniLink' >"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartLink pointer' >"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndLink pointer' >"+dates[i]+"</span>");
        }

        $(".preMonth").attr("href","/page/calendar?empId="+auth+"&year="+nowYear+"&month="+(nowMonth-1));
        $(".nextMonth").attr("href","/page/calendar?empId="+auth+"&year="+nowYear+"&month="+(nowMonth+1));
    }
    // 일정 조회 및 뷰단으로 넘기기
    let start = new Date(nowYear, nowMonth-1, 1);
    let end = new Date(nowYear, nowMonth, 0);

    let startDate = changeDateType(start);
    let endDate = changeDateType(end);

    let schEmpName = selectMyName(auth);
    let json = JSON.stringify({"startDate":startDate,"endDate":endDate, "schEmpName":schEmpName});
    $.ajax({
        url:"/sch/listSchedule/",
        type:"post",
        headers: {"Content-Type":"application/json"},
        data: json,
        dataType : "json",
        success: function(res){
            for(let i=0;i<res.length;i++){
                let startPoint = res[i].schStartDate.lastIndexOf("-");
                let lastPoint = res[i].schStartDate.lastIndexOf(" ");
                let schStartDate = res[i].schStartDate.slice(startPoint+1, lastPoint);
                let zero = schStartDate.slice(0,1);
                let comparison = null;
                if(zero == 0){
                    comparison = schStartDate.substring(1,2);
                }else{
                    comparison = schStartDate;
                }
                if(res[i].schCalName == "내캘린더"){
                    for(let j=0;j<$(".link").length;j++){
                        if(comparison == $(".link")[j].textContent ){
                            $(".link")[j].parentElement.insertAdjacentHTML('beforeend', "" +
                                "<div class='schList'>" +
                                "   <div class=\'mySchedule\'>"+res[i].schTitle+"</div>" +
                                "   <input type='hidden' name='hidden' value='"+res[i].schNo+"'>" +
                                "</div>");
                        }
                    }
                }else{
                    for(let j=0;j<$(".link").length;j++){
                        if(comparison == $(".link")[j].textContent ){
                            $(".link")[j].parentElement.insertAdjacentHTML('beforeend', "" +
                                "<div class='schList'>" +
                                "   <div class=\'proSchedule\'>"+res[i].schTitle+"</div>" +
                                "   <input type='hidden' name='hidden' value='"+res[i].schNo+"'>" +
                                "</div>");
                        }
                    }
                }
            }
        }
    })

    //일정 등록 버튼
    $("#btnSchedule").on("click", function () {

        $("#list").css("display", "inline");
        $("#showStartDate").css("display", "inline");
        $("#showEndDate").css("display", "inline");
        createTimeOption();
        changeOneDayCheckedValue();

        let today = new Date();
        let selMonth = today.getMonth()+1;
        let selDate = today.getDate();

        $("#startDate").val(nowYear+". "+selMonth+". "+selDate);
        $("#endDate").val(nowYear+". "+selMonth+". "+selDate);

        let myName = selectMyName(auth);
        $(".todoPaticipantsBox").html("");
        $(".todoPaticipantsBox").append("<div class=\"overTodoEmpName\">\n" +
            "                            <span>"+myName+"</span>\n" +
            "                            <input type=\"button\" value=\"X\" class=\"btnDelTodoEmpName\">\n" +
            "                        </div>");
    });

    // 큰 달력 좌, 우 화살표
    $("#left").on("click", function () {
        location.href="/page/calendar?empId="+auth+"&year="+nowYear+"&month="+(nowMonth-1);
    })
    $("#right").on("click", function () {
        location.href="/page/calendar?empId="+auth+"&year="+nowYear+"&month="+(nowMonth+1);
    })

    // 사이드 달력 좌측 화살표
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
        changeSideCalendar(year, month);
    })

    // 사이드 달력 우측 화살표
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
        changeSideCalendar(year, month);
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
    $(".link").parent().on("click",function (e) {
        if(e.target.className == "mySchedule" || e.target.className == "proSchedule"){

        }else{
            $("#list").css("display", "inline");
            $("#showStartDate").css("display", "inline");
            $("#showEndDate").css("display", "inline");
            createTimeOption();
            changeOneDayCheckedValue();
            let selDate = $(this).children(".link").text();

            $("#startDate").val(nowYear+". "+nowMonth+". "+selDate);
            $("#endDate").val(nowYear+". "+nowMonth+". "+selDate);

            let myName = selectMyName(auth);
            $(".todoPaticipantsBox").html("");
            $(".todoPaticipantsBox").append("<div class=\"overTodoEmpName\">\n" +
                "                            <span>"+myName+"</span>\n" +
                "                            <input type=\"button\" value=\"X\" class=\"btnDelTodoEmpName\">\n" +
                "                        </div>");
        }
    })

    //일정 등록창에서 날짜 클릭시
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
        changeMiniCalendar(year, month, elementId);
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
            changeOneDayCheckedValue();
        }else{
            changeOneDayUncheckedValue();
        }
    })

    //일정 등록창에서 캘린더 선택시
    $("#selCalendar").on("change", function () {
        if($("#selCalendar").val() == "내캘린더"){
            $("#deptName, #todoEmpName").prop("disabled", true);
            $(".todoPaticipantsBox").html("");
        }else{
            $("#deptName, #todoEmpName").prop("disabled", false);
            let myName = selectMyName(auth);
            $(".todoPaticipantsBox").html("");
            $(".todoPaticipantsBox").append("<div class=\"overTodoEmpName\">\n" +
                "                            <span>"+myName+"</span>\n" +
                "                            <input type=\"button\" value=\"X\" class=\"btnDelTodoEmpName\">\n" +
                "                        </div>");
        }
    })

    // 일정 생성시 부서 선택하면 해당 부서 사원 보여주는 기능
    $("#deptName").on("change", function () {
        $("#todoEmpName").html("<option selected>사원명</option>");
        let empDeptName = $("#deptName").val();
        let json = JSON.stringify({"empDeptName":empDeptName});
        $.ajax({
            url:"/emp/searchEmpDept/",
            type:"post",
            headers: {"Content-Type":"application/json"},
            data: json,
            dataType : "json",
            success: function(res){
                if(res.length != 0){
                    for(let i=0;i<res.length;i++){
                        $("#todoEmpName").append("<option value="+res[i].empName+">"+res[i].empName+"</option>")
                    }
                }
            }
        })
    })

    // 일정 참여자 선택시 일정 참여자 박스에 추가되는 기능
    $("#todoEmpName").on("change", function () {
        let nameNum = $(".overTodoEmpName").length;
        let checkFlag = 0;
        for(let i=0;i<nameNum;i++){
            if($(".overTodoEmpName").eq(i).children('span').text() == $(this).val()){
                checkFlag = 1;
                return false;
            }
        }
        if($(this).val() != "사원명" && nameNum == 0){
            $(".todoPaticipantsBox").append("<div class=\"overTodoEmpName\">\n" +
                "                            <span>"+$(this).val()+"</span>\n" +
                "                            <input type=\"button\" value=\"X\" class=\"btnDelTodoEmpName\">\n" +
                "                        </div>");
        } else if($(this).val() != "사원명" && nameNum > 0 && checkFlag == 0){
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

    //반복 선택시 종료 select 박스 보이기


    //일정 등록 추가하기 버튼 클릭시
    $("#btnAdd").on("click", function () {
        // 제목
        let schTitle = $("#inpTodoTitle").val();

        // 일정소유자
        let schOwner = auth;

        // 시작/종료 일자
        let schStartDate = dateDotToBar($("#startDate").val());
        let schEndDate = dateDotToBar($("#endDate").val());

        // 시작/종료 시간
        let schStartTime = "00:00:00";
        let schEndTime = "00:00:00";
        if($("#startTime").val() != "선택"){
            schStartTime = $("#startTime").val()+":00:00";
        }
        if($("#endTime").val() != "선택"){
            schEndTime = $("#endTime").val()+":00:00";
        }

        // 선택 캘린더
        let schCalName = $("#selCalendar").val();

        // 일정 장소
        let schLocation = $("#todoLocation").val();

        // 일정 반복여부
        let schRepeat = $("#repeat").val();
        $("#repeat").on("change", function () {
            schRepeat = $("#repeat").val();
        })

        //일정 알림여부
        let schAlarm = $("#alarm").val();
        $("#alarm").on("change", function () {
            schAlarm = $("#alarm").val();
            // 일정시작시간을 기준 알람에서 선택된값에 따라 알람시간을 구한 후 db에 저장하고 그 이후 실시간 시간의 함수에서
            // 지속적으로 각 스케쥴별 알람시간을 select 하면서 해당되는 알람시간에 알리미가 뜨도록 구현
        })

        //일정 알림시간
        let schAlarmTime = null;
        switch (schAlarm) {
            case "5분전":
                schAlarmTime = schStartDate+" "+($("#startTime").val()-1)+":55:00";
                break;
            case "10분전":
                schAlarmTime = schStartDate+" "+($("#startTime").val()-1)+":50:00";
                break;
            case "15분전":
                schAlarmTime = schStartDate+" "+($("#startTime").val()-1)+":45:00";
                break;
            case "30분전":
                schAlarmTime = schStartDate+" "+($("#startTime").val()-1)+":30:00";
                break;
            case "1시간전":
                schAlarmTime = schStartDate+" "+($("#startTime").val()-1)+":00:00";
                break;
            case "1일전":
                schAlarmTime = alarmDate(schAlarm, $("#startDate").val())+" "+$("#startTime").val()+":00:00";
                break;
            case "2일전":
                schAlarmTime = alarmDate(schAlarm, $("#startDate").val())+" "+$("#startTime").val()+":00:00";
                break;
            case "1주전":
                schAlarmTime = alarmDate(schAlarm, $("#startDate").val())+" "+$("#startTime").val()+":00:00";
                break;
            case "당일오전9시":
                schAlarmTime = schStartDate+" "+"09:00:00";
                break;
            case "당일오후12시":
                schAlarmTime = schStartDate+" "+"12:00:00";
                break;
            case "1일전오전9시":
                schAlarmTime = alarmDate(schAlarm, $("#startDate").val())+" "+"09:00:00";
                break;
        }

        //일정 설명
        let schExplain = $("#todoExplain").val();

        // 추가하기 & 수정하기
        let schEmpName = null;
        if($("#btnAdd").val() == "수정하기"){
            // 참여자 수정시 해당 일정번호의 참여자 일괄 삭제 후 다시 추가
            let schNo = $("input[name='schNo']").val();
            if(schCalName == "프로젝트"){
                let nameNum = $(".overTodoEmpName").length;
                for(let i=0;i<nameNum;i++){
                    schEmpName = $(".overTodoEmpName").eq(i).children('span').text();
                    let json = JSON.stringify({"schNo":schNo, "schEmpName":schEmpName});
                    $.ajax({
                        url:"/sch/updateSchParty/",
                        type:"put",
                        headers: {"Content-Type":"application/json"},
                        data: json,
                        dataType : "text",
                        success: function(res){
                        }
                    })
                }
            }else{
                schEmpName = selectMyName(auth);
                let json = JSON.stringify({"schNo":schNo, "schEmpName":schEmpName});
                $.ajax({
                    url:"/sch/updateSchParty/",
                    type:"put",
                    headers: {"Content-Type":"application/json"},
                    data: json,
                    dataType : "text",
                    success: function(res){
                    }
                })
            }
            // 일정 수정하기
            let json = JSON.stringify({"schNo":schNo,"schOwner":schOwner, "schTitle":schTitle, "schStartDate":schStartDate,
                "schEndDate":schEndDate, "schStartTime":schStartTime, "schEndTime":schEndTime, "schCalName":schCalName,
                "schLocation":schLocation, "schRepeat":schRepeat, "schAlarm":schAlarm, "schAlarmTime":schAlarmTime, "schExplain":schExplain});
            $.ajax({
                url:"/sch/updateSch/",
                type:"put",
                headers: {"Content-Type":"application/json"},
                data: json,
                dataType : "text",
                success: function(res){
                }
            })
        }else{
            // 참여자 DB 저장
            let nameNum = $(".overTodoEmpName").length;
            if(schCalName == "프로젝트"){
                let schNo = 0;
                $.ajax({
                    url:"/sch/lastSchNo/",
                    type:"get",
                    dataType : "text",
                    success: function(res){
                        schNo = Number(res);

                        for(let i=0;i<nameNum;i++){
                            schEmpName = $(".overTodoEmpName").eq(i).children('span').text();
                            let json = JSON.stringify({"schNo":schNo, "schEmpName":schEmpName});
                            $.ajax({
                                url:"/sch/registerSchParty/",
                                type:"post",
                                headers: {"Content-Type":"application/json"},
                                data: json,
                                dataType : "text",
                                success: function(res){
                                }
                            })
                        }
                    }
                })
            }else{
                let schNo = 0;
                $.ajax({
                    url:"/sch/lastSchNo/",
                    type:"get",
                    dataType : "text",
                    success: function(res){
                        schNo = Number(res);
                        let schEmpName = selectMyName(auth);
                        let json = JSON.stringify({"schNo":schNo, "schEmpName":schEmpName});
                        $.ajax({
                            url:"/sch/registerSchParty/",
                            type:"post",
                            headers: {"Content-Type":"application/json"},
                            data: json,
                            dataType : "text",
                            success: function(res){
                            }
                        })
                    }
                })
            }

            // 일정 추가하기 ajax
            let json = JSON.stringify({"schOwner":schOwner, "schTitle":schTitle, "schStartDate":schStartDate, "schEndDate":schEndDate,
                "schStartTime":schStartTime, "schEndTime":schEndTime, "schCalName":schCalName, "schLocation":schLocation,
                "schRepeat":schRepeat, "schAlarm":schAlarm, "schAlarmTime":schAlarmTime, "schExplain":schExplain});
            $.ajax({
                url:"/sch/registerSch/",
                type:"post",
                headers: {"Content-Type":"application/json"},
                data: json,
                dataType : "text",
                success: function(res){
                }
            })
        }
        location.reload();
    })

    //일정 등록 취소 버튼 클릭시
    $(document).on("click","#btnCancel",function(){
        $("#headTitle").text("일정 등록");
        $("#btnAdd").val("추가하기");
        $("#inpTodoTitle").val("");
        $("#chkOneDay").prop("checked", true);
        changeOneDayCheckedValue()
        $("#todoEmpName").prop('selectedIndex',0);
        $("#selCalendar").prop('selectedIndex',0);
        $("#deptName, #todoEmpName").prop("disabled", false);
        $("#repeat").prop('selectedIndex',0);
        $("#alarm").prop('selectedIndex',0);
        $("#todoLocation").val("");
        $("#todoExplain").val("");
        $(".todoPaticipantsBox").html("");
        $("#list").css("display", "none");
    });

    // 큰 캘린더에서 해당 스케쥴 클릭시 스케쥴 박스 나타남
    $(document).on("click", ".schList", function (e) {
        e.stopPropagation();
        let divX = $(this).offset().left;
        let divY = $(this).offset().top;

        let divHalfWidth = $(this).width()/2;
        let divHeight = $(this).height();

        let divCenterX = divX + divHalfWidth-200;
        let divBottomY = divY + divHeight;
        $(".miniScheduleBox").css("left", divCenterX).css("top", divBottomY).css("display", "inline");
        let schNo = $(this).children("input[name='hidden']").val();

        let json = JSON.stringify({"schNo":schNo});
        $.ajax({
            url: "/sch/selectSch/",
            type: "post",
            headers: {"Content-Type": "application/json"},
            data: json,
            dataType: "json",
            success: function (res) {
                $("input[name='schNo']").val(res.schNo);
                $("#schTitle").text(res.schTitle);
                $("#schDate").text(res.schStartDate.slice(0, 10));
                $("#schLocation").text(res.schLocation);
                $("#schAlarm").text(res.schAlarm);
            }
        })
    })

    // 미니 스케쥴박스 외에 클릭시 스케쥴박스 사라짐
    $("body").on('click', function(e) {
        if(!$(e.target).hasClass("miniScheduleBox")) {
            $(".miniScheduleBox").css("display", "none");
        }
    });

    //미니 스케쥴 박스안에서 상세보기 버튼 클릭시
    $("#btnDetail").on("click", function () {
        $("#headTitle").text("세부 일정");
        $("#btnAdd").val("수정하기");
        $("#list").css("display", "inline");
        $("#showStartDate").css("display", "inline");
        $("#showEndDate").css("display", "inline");
        createTimeOption();
        let schNo = $("input[name='schNo']").val();

        $.ajax({
            url: "/sch/selectSch/",
            type: "post",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({"schNo":schNo}),
            dataType: "json",
            success: function (res) {
                $("#inpTodoTitle").val(res.schTitle);
                $("#startDate").val(dateBarToDot(res.schStartDate));
                $("#endDate").val(dateBarToDot(res.schEndDate));
                changeOneDayCheckedValue();
                if(timeTypeChange(res.schStartTime) != "선택"){
                    $("#chkOneDay").prop("checked", false);
                    changeOneDayUncheckedValue();
                }
                $("#startTime").val(timeTypeChange(res.schStartTime));
                $("#endTime").val(timeTypeChange(res.schEndTime));
                $("#selCalendar").val(res.schCalName);
                $("#todoLocation").val(res.schLocation);
                $("#repeat").val(res.schRepeat);
                $("#alarm").val(res.schAlarm);
                $("#todoExplain").text(res.schExplain);
            }
        })

        $.ajax({
            url: "/sch/selectSchParty/",
            type: "post",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({"schNo":schNo}),
            dataType: "json",
            success: function (res) {
                for(let i=0;i<res.length;i++){
                    $(".todoPaticipantsBox").append("<div class=\"overTodoEmpName\">\n" +
                        "                            <span>"+res[i].schEmpName+"</span>\n" +
                        "                            <input type=\"button\" value=\"X\" class=\"btnDelTodoEmpName\">\n" +
                        "                        </div>");
                }
            }
        })
    })

    //미니 스케쥴 박스안에서 삭제 버튼 클릭시
    $("#btnDel").on("click", function () {
        let yesOrNo = confirm("정말 삭제하시겠습니까?");
        if(yesOrNo == true){
            let schNo = $("input[name='schNo']").val();
            let schOwner = auth;
            let jsonSchedule = JSON.stringify({"schNo":schNo, "schOwner":schOwner});
            $.ajax({
                url: "/sch/deleteSch/",
                type: "delete",
                headers: {"Content-Type": "application/json"},
                data: jsonSchedule,
                dataType: "text",
                success: function (res) {
                    if(res == 0){
                        alert("본 일정의 작성자만 삭제가 가능합니다.");
                        return false;
                    }else{
                        let jsonSchParty = JSON.stringify({"schNo":schNo});
                        $.ajax({
                            url: "/sch/deleteSchParty/",
                            type: "delete",
                            headers: {"Content-Type": "application/json"},
                            data: jsonSchParty,
                            dataType: "text",
                            success: function (res) {
                            }
                        })
                    }
                }
            })
            location.reload();
        }
    })

    //직원 로그아웃
    $("#logout").on("click", function () {
        let yesOrNo = confirm("로그아웃 하시겠습니까?");
        if(yesOrNo == true){
            location.href = "/page/logout";
        }
    })

    //캘린더 선택 조회
    $("#cal1").on("click", function () {
        if($("#cal1").is(":checked")==true){
            $(".mySchedule").css("display", "block");
        }else{
            $(".mySchedule").css("display", "none");
        }
    })
    $("#cal2").on("click", function () {
        if($("#cal2").is(":checked")==true){
            $(".proSchedule").css("display", "block");
        }else{
            $(".proSchedule").css("display", "none");
        }
    })
});

function notify(res) {
    let check = checkNotificationPromise();
    let options = {
        body: res.schStartDate.slice(0, 10)+" "+res.schStartTime+", "+res.schLocation,
        icon : '/assets/images/neoul.png'
    }

    if (Notification.permission === "granted") {
        let notification = new Notification(res.schTitle, options);

        // 5초뒤 알람 닫기
        // setTimeout(function(){
        //     notification.close();
        // }, 5000);
    }
    // 사용자가 알림을 거부한 경우
    else {
        // 일반적인 모달 alert로 폴백
        alert('알림을 차단하셨습니다.\n브라우저의 사이트 설정에서 변경하실 수 있습니다.');
    }
}

function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch(e) {
        return false;
    }
    return true;
}

// 알림 권한 요청
function getNotificationPermission() {
    // 브라우저 지원 여부 체크
    if (!("Notification" in window)) {
        alert("데스크톱 알림을 지원하지 않는 브라우저입니다.");
    }
    // 데스크탑 알림 권한 요청
    Notification.requestPermission().then(function(result) {
        if(result == 'denied') {
            alert('알림을 차단하셨습니다.\n브라우저의 사이트 설정에서 변경하실 수 있습니다.');
            return false;
        }
    });
}

function startTime() {
    setInterval(function () {
        let dateString;

        let newDate = new Date();

        //String.slice(-2) : 문자열을 뒤에서 2자리만 출력한다. (문자열 자르기)
        dateString = newDate.getFullYear() + "-";
        dateString += ("0" + (newDate.getMonth() + 1)).slice(-2) + "-"; //월은 0부터 시작하므로 +1을 해줘야 한다.
        dateString += ("0" + newDate.getDate()).slice(-2) + " ";
        dateString += ("0" + newDate.getHours()).slice(-2) + ":";
        dateString += ("0" + newDate.getMinutes()).slice(-2) + ":";
        dateString += ("0" + newDate.getSeconds()).slice(-2);
        //document.write(dateString); 문서에 바로 그릴 수 있다.
        $("input[name='nowDateTime']").val(dateString);
        let empId = $("input[name='empId']").val();

        let json = JSON.stringify({"schAlarmTime":dateString});
        $.ajax({
            url: "/sch/selectSchBySchAlarmTime/",
            type: "post",
            headers: {"Content-Type": "application/json"},
            data: json,
            dataType: "json",
            success: function (res) {
                let schedule = res;
                if(res != null && res.schCalName == "내캘린더" && res.schOwner == empId){
                    notify(res);
                }else if(res != null && res.schCalName == "프로젝트"){
                    let schNo = res.schNo;
                    let schEmpName = selectMyName(empId);
                    $.ajax({
                        url:"/sch/selectScheduleCheck/",
                        type:"post",
                        headers: {"Content-Type":"application/json"},
                        data: JSON.stringify({"schNo":schNo, "schEmpName":schEmpName}),
                        dataType : "json",
                        success: function(res){
                            if(res != null){
                                notify(schedule);
                            }
                        }
                    });
                }
            }
        })
    }, 1000);
}

function alarmDate(schAlarm, dotDate) {
    let firstPoint = dotDate.indexOf(".");
    let lastPoint = dotDate.lastIndexOf(".");
    let year = dotDate.slice(0,firstPoint);
    let month = dotDate.slice(6,lastPoint);
    let date = dotDate.slice(lastPoint+2,12);

    let selectDate;
    if(schAlarm == "1일전" || schAlarm == "1일전오전9시"){
        selectDate = new Date(year, month-1, date-1);
    }else if(schAlarm == "2일전"){
        selectDate = new Date(year, month-1, date-2);
    }else if(schAlarm == "1주전"){
        selectDate = new Date(year, month-1, date-7);
    }

    let yyyy = selectDate.getFullYear().toString();
    let MM = (selectDate.getMonth()+1).toString();
    let dd = selectDate.getDate().toString();

    return yyyy + "-" + (MM[1] ? MM : "0" + MM[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
}

function selectMyName(empId) {
    let myName;
    $.ajax({
        url:"/emp/selectEmpName/",
        type:"post",
        headers: {"Content-Type":"application/json"},
        data: JSON.stringify({"empId":empId}),
        async: false,
        dataType : "text",
        success: function(res){
            myName = res;
        }
    });
    return myName;
}

function changeSideCalendar(year, month) {
    $.ajax({
        url:"/cal/"+year+"/"+month,
        type:"get",
        data: "json",
        success: function(res){
            for(let i=0;i<42;i++){

                if(res[i].month < month ){
                    $(".miniDate").eq(i).html("<span class='miniPreMonth fontGray'>"+res[i].date+"</span>");
                }else if(res[i].month > month){
                    $(".miniDate").eq(i).html("<span class='miniNextMonth fontGray'>"+res[i].date+"</span>");
                }
                else{
                    $(".miniDate").eq(i).html("<span class='miniLink' >"+res[i].date+"</span>");
                }
            }
        }
    })
}
function timeTypeChange(beforeTime) {
    let afterTime = beforeTime.slice(0,2);
    if(afterTime == "00"){
        afterTime = "선택";
    }
    return afterTime;
}

function dateBarToDot(barDate) {
    let firstPoint = barDate.indexOf("-");
    let lastPoint = barDate.lastIndexOf("-");
    let year = barDate.slice(0,firstPoint);
    let month = Number(barDate.slice(firstPoint+1,lastPoint));
    let date = Number(barDate.slice(lastPoint+1, 10));

    return year + ". " + month + ". " + date;
}

function dateDotToBar(dotDate) {
    let firstPoint = dotDate.indexOf(".");
    let lastPoint = dotDate.lastIndexOf(".");
    let year = dotDate.slice(0,firstPoint);
    let month = dotDate.slice(6,lastPoint);
    let date = dotDate.slice(lastPoint+2,12);

    let selectDate = new Date(year, month-1, date);
    let yyyy = selectDate.getFullYear().toString();
    let MM = (selectDate.getMonth()+1).toString();
    let dd = selectDate.getDate().toString();

    return yyyy + "-" + (MM[1] ? MM : "0" + MM[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
}

function changeDateType(oriDate) {
    let date = new Date(oriDate);
    let year = date.getFullYear().toString();
    let month = (date.getMonth()+1).toString();
    let day = date.getDate().toString();

    return year + "-" + (month[1] ? month : "0" + month[0]) + "-" + (day[1] ? day : "0" + day[0]);
}

function changeOneDayCheckedValue() {
    $("#startDate").css("width","209px");
    $("#showStartDate").css("width","221px");
    $("#startTime").css("display","none");
    $("#endDate").css("width","209px");
    $("#showEndDate").css("width","221px");
    $("#endTime").css("display","none");
    $("#startTime, #endTime").val("선택");
    $("#alarm").html("");
    $("#alarm").append("<option value='알림없음'>알림없음</option>")
        .append("<option value='당일오전9시'>당일 오전 09:00</option>")
        .append("<option value='당일오후12시'>당일 오후 12:00</option>")
        .append("<option value='1일전오전9시'>1일전 오전 09:00</option>");
}

function changeOneDayUncheckedValue() {
    $("#startDate").css("width","100px");
    $("#showStartDate").css("width","100px");
    $("#startTime").css("display","inline");
    $("#endDate").css("width","100px");
    $("#showEndDate").css("width","100px");
    $("#endTime").css("display","inline");
    $("#alarm").html("");
    $("#alarm").append("<option value='알림없음'>알림없음</option>")
        .append("<option value='5분전'>5분 전</option>")
        .append("<option value='10분전'>10분 전</option>")
        .append("<option value='15분전'>15분 전</option>")
        .append("<option value='30분전'>30분 전</option>")
        .append("<option value='1시간전'>1시간 전</option>")
        .append("<option value='1일전'>1일 전</option>")
        .append("<option value='2일전'>2일 전</option>")
        .append("<option value='1주전'>1주 전</option>");
}

function createTimeOption() {
    $("#startTime, #endTime").html("");
    $("#startTime, #endTime").append("<option value=\"선택\">선택</option>");
    for(let i=1;i<25;i++){
        if(i<10){
            $("#startTime, #endTime").append(" <option value='0"+i+"'> 0"+i+":00 </option>");
        }else{
            $("#startTime, #endTime").append(" <option value='"+i+"'> "+i+":00 </option>");
        }
    }
}

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