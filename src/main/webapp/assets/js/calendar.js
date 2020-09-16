$(function () {
    //알림 권한 요청
    getNotificationPermission();

    // 헤드의 너울캘린더 클릭시
    $("#headLeft").on("click", function () {
        let now = new Date();
        let month = now.getMonth()+1
        let year = now.getFullYear();
        location.href="/page/calendar?empId="+auth+"&year="+year+"&month="+(month);
    })

    // 큰 캘린더 만들기
    let input = document.querySelectorAll(".date");
    let now = new Date();
    let todayYear = now.getFullYear();
    let todayMonth = now.getMonth()+1;
    let today = now.getDate();

    for(let i=0;i<42;i++){
        let year = years[i];
        let month = months[i];
        let item = input.item(i);
        item.dataset.month = month;
        item.dataset.year = year;
        if(item.dataset.month != nowMonth ){
            item.style.color = "#ccc";
        }
        // 1월의 이전달 날짜 클릭시 2월로 가는 문제, 12월의 다음달 날짜 클릭시 11월로 가는 문제 해결 요망
        if(item.dataset.month < nowMonth ){
            $(".date").eq(i).html("<a class='preMonth fontGray datePosition decoNone'>"+dates[i]+"</a>");
            $(".miniDate").eq(i).html("<span class='miniPreMonth fontGray'>"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartPreMonth fontGray'>"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndPreMonth fontGray'>"+dates[i]+"</span>");
        }else if(item.dataset.month > nowMonth){
            $(".date").eq(i).html("<a class='nextMonth fontGray datePosition decoNone'>"+dates[i]+"</a>");
            $(".miniDate").eq(i).html("<span class='miniNextMonth fontGray'>"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartNextMonth fontGray'>"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndNextMonth fontGray'>"+dates[i]+"</span>");
        }else{
            $(".date").eq(i).html("<a class='link pointer datePosition' >"+dates[i]+"</a>");
            if(nowMonth == todayMonth && dates[i] == today && nowYear == todayYear){
                $(".date").eq(i).html("<a class='link pointer datePosition' id='today' >"+dates[i]+"</a>");
            }
            $(".miniDate").eq(i).html("<span class='miniLink' >"+dates[i]+"</span>");
            $(".miniStartDate").eq(i).html("<span class='miniStartLink pointer' >"+dates[i]+"</span>");
            $(".miniEndDate").eq(i).html("<span class='miniEndLink pointer' >"+dates[i]+"</span>");
        }
        if(item.dataset.month > nowMonth && item.dataset.year < nowYear){
            $(".date").eq(i).html("<a class='preMonth fontGray datePosition decoNone'>"+dates[i]+"</a>");
        }else if(item.dataset.month < nowMonth && item.dataset.year > nowYear){
            $(".date").eq(i).html("<a class='nextMonth fontGray datePosition decoNone'>"+dates[i]+"</a>");
        }

        $(".preMonth").attr("href","/page/calendar?empId="+auth+"&year="+nowYear+"&month="+(nowMonth-1));
        $(".nextMonth").attr("href","/page/calendar?empId="+auth+"&year="+nowYear+"&month="+(nowMonth+1));
    }
    // 일정 처리
    let schEmpName = selectMyName(auth);
    let start = new Date($(".date")[0].dataset.year, $(".date")[0].dataset.month-1, $(".date").first().text());
    let end = new Date($(".date")[41].dataset.year, $(".date")[41].dataset.month-1, $(".date").last().text());

    let startDate = changeDateType(start);
    let endDate = changeDateType(end);
    let taskMap = new Array();

    let json = JSON.stringify({"startDate":startDate,"endDate":endDate, "schEmpName":schEmpName});
    $.ajax({
        url: "/sch/listSchedule/",
        type: "post",
        headers: {"Content-Type": "application/json"},
        async: false,
        data: json,
        dataType: "json",
        success: function (tasks) {
            // 각 일자별로 단건 일정+반복 일정 구해서 calcTask 객체에 담기
            // 테스크맵 배열에 이름은 같은 일자 반복도 가능, 일자로 배열내의 내용은 단건일정, 반복일정 모두 넣고
            // 단건일정은 schStartDate가 있고 반복안함으로 처리된 일정 가져오기
            // 반복일정은 반복이 되는 일자를 구하고(시작날짜와 반복이 끝나는 날짜 사이) 매일, 매주, 매월, 매년으로 되어 있는 조건으로 반복일정 구하기
            console.log(tasks);
            for(let i=0;i<tasks.length;i++){
                let rowData = tasks[i];
                let oneScheduleDate = rowData.schStartDate.slice(0, 10);
                let alarmTime = rowData.schAlarmTime;
                if(alarmTime == null){
                    alarmTime = "00:00:00";
                }
                if(rowData.schRepeat == '반복안함'){
                    let chgOneScheduleDate = oneScheduleDate+" "+alarmTime+" O";
                    for(let j=0;j<Object.keys(taskMap).length;j++){
                        let keyName = Object.keys(taskMap)[j];
                        if(chgOneScheduleDate == keyName){
                            chgOneScheduleDate = chgOneScheduleDate+"O";
                        }
                    }
                    let excludeSch = excludeSchCheck(chgOneScheduleDate, schEmpName);
                    if(excludeSch == null){
                        taskMap[chgOneScheduleDate] = rowData;
                    }
                }else if(rowData.schRepeat == '매일'){
                    let firstDate = dateBarToDate(oneScheduleDate);
                    let lastDate = dateBarToDate(rowData.schRepeatDate.slice(0, 10));
                    let betweenDate = (lastDate.getTime() - firstDate.getTime())/1000/60/60/24;
                    for(let j=betweenDate;j>-1;j--){
                        if(firstDate.getDay() != 0 && firstDate.getDay() != 6){
                            let chgFirstDate = changeDateType(firstDate)+" "+alarmTime+" R";
                            for(let k=0;k<Object.keys(taskMap).length;k++){
                                let keyName = Object.keys(taskMap)[k];
                                if(chgFirstDate == keyName){
                                    chgFirstDate = chgFirstDate+"R";
                                }
                            }
                            let excludeSch = excludeSchCheck(chgFirstDate, schEmpName);
                            if(excludeSch == null){
                                taskMap[chgFirstDate] = rowData;
                            }
                        }
                        firstDate.setDate(firstDate.getDate()+1);
                    }
                }else if(rowData.schRepeat == '매주'){
                    let firstDate = dateBarToDate(oneScheduleDate);
                    let lastDate = dateBarToDate(rowData.schRepeatDate.slice(0, 10));
                    let betweenDate = (lastDate.getTime() - firstDate.getTime())/1000/60/60/24;
                    for(let j=betweenDate;j>-1;j=j-7){
                        if(firstDate.getDay() != 0 && firstDate.getDay() != 6){
                            let chgFirstDate = changeDateType(firstDate)+" "+alarmTime+" R";
                            for(let k=0;k<Object.keys(taskMap).length;k++){
                                let keyName = Object.keys(taskMap)[k];
                                if(chgFirstDate == keyName){
                                    chgFirstDate = chgFirstDate+"R";
                                }
                            }
                            let excludeSch = excludeSchCheck(chgFirstDate, schEmpName);
                            if(excludeSch == null){
                                taskMap[chgFirstDate] = rowData;
                            }
                        }
                        firstDate.setDate(firstDate.getDate()+7);
                    }
                }else if(rowData.schRepeat == '매월'){
                    let firstDate = dateBarToDate(oneScheduleDate);
                    let lastDate = dateBarToDate(rowData.schRepeatDate.slice(0, 10));

                    let year = lastDate.getFullYear()-firstDate.getFullYear();
                    let month = lastDate.getMonth()-firstDate.getMonth();
                    let date = lastDate.getDate() - firstDate.getDate();

                    let differentMonth = year * 12 + month + (date>=0?0:-1);

                    for (let j=0;j<differentMonth+1;j++){
                        if(firstDate.getDay() != 0 && firstDate.getDay() != 6){
                            let chgFirstDate = changeDateType(firstDate)+" "+alarmTime+" R";
                            for(let k=0;k<Object.keys(taskMap).length;k++){
                                let keyName = Object.keys(taskMap)[k];
                                if(chgFirstDate == keyName){
                                    chgFirstDate = chgFirstDate+"R";
                                }
                            }
                            let excludeSch = excludeSchCheck(chgFirstDate, schEmpName);
                            if(excludeSch == null){
                                taskMap[chgFirstDate] = rowData;
                            }
                        }
                        firstDate.setMonth(firstDate.getMonth()+1);
                    }
                }else if(rowData.schRepeat == '매년'){
                    let firstDate = dateBarToDate(oneScheduleDate);
                    let lastDate = dateBarToDate(rowData.schRepeatDate.slice(0, 10));

                    let differentYear = lastDate.getFullYear()-(firstDate.getFullYear()-1);

                    for (let j=0;j<differentYear+1;j++){
                        if(firstDate.getDay() != 0 && firstDate.getDay() != 6){
                            let chgFirstDate = changeDateType(firstDate)+" "+alarmTime+" R";
                            for(let k=0;k<Object.keys(taskMap).length;k++){
                                let keyName = Object.keys(taskMap)[k];
                                if(chgFirstDate == keyName){
                                    chgFirstDate = chgFirstDate+"R";
                                }
                            }
                            let excludeSch = excludeSchCheck(chgFirstDate, schEmpName);
                            if(excludeSch == null){
                                taskMap[chgFirstDate] = rowData;
                            }
                        }
                        firstDate.setFullYear(firstDate.getFullYear()+1);
                    }
                }
            }
        }
    })
    console.log(Object.keys(taskMap));
    console.log(taskMap);

    // console.log(taskMap);


    // 알림기능을 위한 실시간 시간출력 함수
    startTime(taskMap);

    // var taskMap = {};
    // for (var i = 0; i < tasks.length; i++) {
    //     var rowData = tasks[i];
    //     var calcTask = rowData... sld; -> rowData를 계산/가공
    //     arrangeTask = taskMap[oneScheduleDate];
    //     if (arrangeTask == undefined || arrangeTask == null){
    //                 arrangeTask = taskMap[oneScheduleDate] = [];
    //     }
    //     arrangeTask[arrangeTask.length] = rowData;
    // }

    // 뷰단에 단건, 반복일정 표현
    for (let i = 0; i < 42; i++) {
        let todayOriDate = new Date($(".date")[i].dataset.year, $(".date")[i].dataset.month-1, $(".date")[i].textContent);
        let today = changeDateType(todayOriDate);
        let todayMonth = today.slice(today.indexOf("-")+1, today.lastIndexOf("-"));
        if(todayMonth.slice(0,1) == "0"){
            todayMonth = todayMonth.slice(1,2);
        }
        for(let j=0;j<Object.keys(taskMap).length;j++){
            if(Object.keys(taskMap)[j].slice(20,21) == "O" && today == Object.keys(taskMap)[j].slice(0,10)){

                let oneTask = taskMap[Object.keys(taskMap)[j]];
                if(oneTask.schCalName == "내캘린더" && todayMonth == nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'mySchedule\'>"+oneTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+oneTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }else if(oneTask.schCalName == "내캘린더" && todayMonth != nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'myScheduleSoft\'>"+oneTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+oneTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }else if(oneTask.schCalName == "프로젝트" && todayMonth == nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'proSchedule\'>"+oneTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+oneTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }else if(oneTask.schCalName == "프로젝트" && todayMonth != nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'proScheduleSoft\'>"+oneTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+oneTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }
            }else if(Object.keys(taskMap)[j].slice(20,21) == "R" && today == Object.keys(taskMap)[j].slice(0,10)){

                let repeatTask = taskMap[Object.keys(taskMap)[j]];
                if(repeatTask.schCalName == "내캘린더" && todayMonth == nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'mySchedule\'>"+repeatTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+repeatTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }else if(repeatTask.schCalName == "내캘린더" && todayMonth != nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'myScheduleSoft\'>"+repeatTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+repeatTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }else if(repeatTask.schCalName == "프로젝트" && todayMonth == nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'proSchedule\'>"+repeatTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+repeatTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }else if(repeatTask.schCalName == "프로젝트" && todayMonth != nowMonth){
                    $(".date")[i].insertAdjacentHTML('beforeend', "" +
                        "<div class='schList'>" +
                        "   <div class=\'proScheduleSoft\'>"+repeatTask.schTitle+"</div>" +
                        "   <input type='hidden' name='hidden' value='"+repeatTask.schNo+"'>" +
                        "   <input type='hidden' name='taskMapKey' value='"+Object.keys(taskMap)[j]+"'>" +
                        "</div>");
                }
            }
        }

        // console.log(today);

        // let today1 = yearMonth + dayMax;
        // let arrangeTask = taskMap[today];
        // if (arrangeTask == undefined || arrangeTask == null || arrangeTask.length == 0)
        //     continue;

    }

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
    $(".preMonth").parent().on("click",function (e) {
        if(e.target.className == "myScheduleSoft" || e.target.className == "proScheduleSoft"){

        }else{
            $(this).children().get(0).click();
        }
    })

    //큰 캘린더 다음 달 날짜 클릭시
    $(".nextMonth").parent().on("click",function (e) {
        if(e.target.className == "myScheduleSoft" || e.target.className == "proScheduleSoft"){

        }else{
            $(this).children().get(0).click();
        }
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
        if(!$(e.target).hasClass("selStartDate")) {
            $(".selRepeatDate").css("display", "none");
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
        $("#startDate").val($("#startMiniYear").text()+". "+newMonth+". "+newDate);
        $("#endDate").val($("#startDate").val().slice(0, 5)+" "+newMonth+". "+newDate);
        $("#repeatEndDate").val($("#startDate").val().slice(0, 5)+" "+newMonth+". "+newDate);
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
        $("#endDate").val($("#endMiniYear").text()+". "+newMonth+". "+newDate);

        let dotStart = dateDotToBar($("#startDate").val());
        let start = dateBarToDate(dotStart);
        let dotEnd = dateDotToBar($("#endDate").val());
        let end = dateBarToDate(dotEnd);

        if(start.getTime() != end.getTime()){
            $("#repeat").attr("disabled", true);
            $("#repeat").prop('selectedIndex',0);
            $(".endRepeat").css("display","none");
        }else if(start.getTime() == end.getTime()){
            $("#repeat").attr("disabled", false);
        }
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
    $("#repeat").on("change", function () {
        if($("#repeat").val() == "반복안함"){
            $(".endRepeat").css("display", "none");
            $("#showRepeatDate").css("display", "none");
        }else if($("#repeat").val() == "매일" || $("#repeat").val() == "매주"
            || $("#repeat").val() == "매월" || $("#repeat").val() == "매년"){
            $(".endRepeat").css("display", "inline");
            $("#showRepeatDate").css("display", "inline");
            $("#repeatEndDate").val($("#startDate").val());
        }
    })

    // 반복 종료날짜 input 클릭시
    $("#showRepeatDate").on("click", function () {
        let repeatMiniYear = $("#repeatEndDate").val().slice(0, 4);
        let repeatMiniMonth = $("#repeatEndDate").val().slice(5, $("#repeatEndDate").val().lastIndexOf("."));
        let elementId = "repeatCal";
        $("#repeatMiniYear").text(repeatMiniYear);
        $("#repeatMiniMonth").text(repeatMiniMonth);
        changeMiniCalendar(repeatMiniYear, repeatMiniMonth, elementId);

        $(".selRepeatDate").css("display", "inline");
    });

    // 반복 종료날짜 달력 좌, 우 화살표
    $(".repeatMiniArrows").on("click", function () {
        let year = Number($("#repeatMiniYear").text());
        let month = Number($("#repeatMiniMonth").text());
        let elementId = $(this).attr('id');
        changeMiniCalendar(year, month, elementId);
    })

    // 반복 종료날짜 달력에서 일자 클릭시
    $(".miniRepeatDate").on("click", function () {
        let newMonth = $(this).children(".hiddenRepeatMonth").val();
        let newDate = $(this).text();
        $("#repeatEndDate").val($("#repeatMiniYear").text()+". "+newMonth+". "+newDate);
        $(".selRepeatDate").css("display", "none");
    })

    //일정 등록 추가하기 버튼 클릭시
    $("#btnAdd").on("click", function () {
        // 제목
        let schTitle = $("#inpTodoTitle").val();

        // 일정소유자
        let schOwner = auth;

        // 시작/종료 일자
        let schStartDate = dateDotToBar($("#startDate").val());
        let repeatStart = dateBarToDate(schStartDate);
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

        //일정 반복종료날짜
        let schRepeatDate;
        let repeatEnd;
        if(schRepeat != "반복안함"){
            let repeatDateDot = $("#repeatEndDate").val();
            schRepeatDate = dateDotToBar(repeatDateDot);
            repeatEnd = dateBarToDate(schRepeatDate);

        }

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
                schAlarmTime = ($("#startTime").val()-1)+":55:00";
                break;
            case "10분전":
                schAlarmTime = ($("#startTime").val()-1)+":50:00";
                break;
            case "15분전":
                schAlarmTime = ($("#startTime").val()-1)+":45:00";
                break;
            case "30분전":
                schAlarmTime = ($("#startTime").val()-1)+":30:00";
                break;
            case "1시간전":
                schAlarmTime = ($("#startTime").val()-1)+":00:00";
                break;
            case "1일전":
                schAlarmTime = $("#startTime").val()+":00:00";
                break;
            case "2일전":
                schAlarmTime = $("#startTime").val()+":00:00";
                break;
            case "1주전":
                schAlarmTime = $("#startTime").val()+":00:00";
                break;
            case "당일오전9시":
                schAlarmTime = "09:00:00";
                break;
            case "당일오후12시":
                schAlarmTime = "12:00:00";
                break;
            case "1일전오전9시":
                schAlarmTime = "09:00:00";
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
                        async: false,
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
                    async: false,
                    data: json,
                    dataType : "text",
                    success: function(res){
                    }
                })
            }
            // 일정 수정하기
            let json = JSON.stringify({"schNo":schNo,"schOwner":schOwner, "schTitle":schTitle, "schStartDate":schStartDate,
                "schEndDate":schEndDate, "schStartTime":schStartTime, "schEndTime":schEndTime, "schCalName":schCalName,
                "schLocation":schLocation, "schRepeat":schRepeat, "schRepeatDate":schRepeatDate, "schAlarm":schAlarm, "schAlarmTime":schAlarmTime, "schExplain":schExplain});
            $.ajax({
                url:"/sch/updateSch/",
                type:"put",
                headers: {"Content-Type":"application/json"},
                async: false,
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
                    async: false,
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
                                async: false,
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
                    async: false,
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
                            async: false,
                            data: json,
                            dataType : "text",
                            success: function(res){
                            }
                        })
                    }
                })
            }
            // let betweenDate = (repeatEnd.getTime() - repeatStart.getTime())/1000/60/60/24;
            // 일정 추가하기 ajax
            let json = JSON.stringify({"schOwner":schOwner, "schTitle":schTitle, "schStartDate":schStartDate, "schEndDate":schEndDate,
                "schStartTime":schStartTime, "schEndTime":schEndTime, "schCalName":schCalName, "schLocation":schLocation,
                "schRepeat":schRepeat, "schRepeatDate":schRepeatDate, "schAlarm":schAlarm, "schAlarmTime":schAlarmTime, "schExplain":schExplain});
            $.ajax({
                url:"/sch/registerSch/",
                type:"post",
                headers: {"Content-Type":"application/json"},
                async: false,
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
        $(".endRepeat").css("display", "none");
        $("#showStartDate").css("display", "none");
        $("#showEndDate").css("display", "none");
        $("#showRepeatDate").css("display", "none");
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
        let selDate = $(this).parent().children().first().text();
        let chgMonth = $(this).parent().data().month;
        let taskMapKey = $(this).children("input[name='taskMapKey']").val();

        let json = JSON.stringify({"schNo":schNo});
        $.ajax({
            url: "/sch/selectSch/",
            type: "post",
            headers: {"Content-Type": "application/json"},
            data: json,
            dataType: "json",
            success: function (res) {
                $("input[name='schNo']").val(res.schNo);
                $("input[name='schTaskMapKey']").val(taskMapKey);
                $("#schTitle").text(res.schTitle);
                $("#schDate").text(res.schStartDate.slice(0, 10));
                if(res.schRepeat != "반복안함"){
                    if(chgMonth<10){
                        chgMonth = "0"+chgMonth;
                    }
                    if(selDate<10){
                        selDate = "0"+selDate;
                    }
                    $("#schDate").text(nowYear+"-"+chgMonth+"-"+selDate+" (반복 시작 : "+res.schStartDate.slice(0, 10)+")");
                    let selectDate = nowYear+"-"+chgMonth+"-"+selDate;
                    $("input[name='selectDate']").val(selectDate);
                }
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
        $("#showRepeatDate").css("display", "inline");
        createTimeOption();
        let schNo = $("input[name='schNo']").val();
        let schDate = $("#schDate").text();

        $.ajax({
            url: "/sch/selectSch/",
            type: "post",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify({"schNo":schNo}),
            dataType: "json",
            success: function (res) {
                $("#inpTodoTitle").val(res.schTitle);
                $("#startDate").val(dateBarToDot(schDate.slice(0,10)));
                $("#endDate").val(dateBarToDot(schDate.slice(0,10)));
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
                if(res.schRepeat != "반복안함"){
                    $(".endRepeat").css("display", "inline");
                    let repeatDate = dateBarToDot(res.schRepeatDate);
                    $("#repeatEndDate").val(repeatDate);
                }
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
        // 만들어진 팝업창을 이용해서 삭제 팝업을 만들것
        // 팝업의 이동은 css 포지션을 활용해서 움직이도록 할것
        let taskMapKey = $("input[name='schTaskMapKey']").val();
        if(taskMapKey.slice(20, 21) == "O"){
            $("#oneSchDeleteBox").css("display", "inline");
        }else if(taskMapKey.slice(20, 21) == "R"){
            $("#reSchDeleteBox").css("display", "inline");
        }
    })

    //단건일정 삭제 확인 버튼 클릭시
    $("#btnOneSchDelConfirm").on("click", function (){
        let schNo = $("input[name='schNo']").val();
        let schOwner = auth;
        allScheduleDelete(schNo, schOwner);
        location.reload();
    })

    // 단건일정 삭제 취소 버튼 클릭시
    $("#btnOneSchDelCancel").on("click", function (){
        $("#oneSchDeleteBox").css("display", "none");
    })

    // 반복일정 삭제 확인 버튼 클릭시
    $("#btnReSchDelConfirm").on("click", function (){
        let schNo = $("input[name='schNo']").val();
        let schOwner = auth;
        let taskMapKey = $("input[name='schTaskMapKey']").val();
        let radioValue = $('input[name="delSch"]:checked').val();
        if(radioValue == "전체일정"){
            allScheduleDelete(schNo, schOwner);
        }else if(radioValue == "이일정만"){
            let result = ownerCheck(schNo, schOwner);
            if(result == null){
                alert("본 일정의 작성자만 수정이 가능합니다.");
                $('#btnReSchDelCancel').trigger('click');
                return false;
            }else{
                oneScheduleExclude(schNo, taskMapKey);
                alert("일정이 수정되었습니다.");
            }
        }else if(radioValue == "이일정이후모든일정"){
            let selectStringDate = $("input[name='selectDate']").val();
            let selectRealDate = dateBarToDate(selectStringDate);
            let schRepeatDate = changeDateType(selectRealDate)+" 00:00:00";
            updateSchRepeatDate(schNo, schOwner, schRepeatDate)
        }
        location.reload();
    })

    // 반복일정 삭제 취소 버튼 클릭시
    $("#btnReSchDelCancel").on("click", function (){
        $("input:radio[name='delSch']:radio[value='이일정만']").prop('checked', true);
        $("#reSchDeleteBox").css("display", "none");
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

function updateSchRepeatDate(schNo, schOwner, schRepeatDate) {
    let json = JSON.stringify({"schNo":schNo,"schOwner":schOwner, "schRepeatDate":schRepeatDate});
    $.ajax({
        url:"/sch/updateSchRepeatDate/",
        type:"put",
        headers: {"Content-Type":"application/json"},
        async: false,
        data: json,
        dataType : "text",
        success: function(res){
            if(res == 0){
                alert("본 일정의 작성자만 수정이 가능합니다.");
                $('#btnReSchDelCancel').trigger('click');
                return false;
            }else{
                alert("일정이 수정되었습니다.");
            }
        }
    })
}

function excludeSchCheck(taskMapKey, schEmpName) {
    let result;
    let jsonExcludeSch = JSON.stringify({"taskMapKey":taskMapKey, "schEmpName":schEmpName});
    $.ajax({
        url: "/sch/selectExcludeSch/",
        type: "post",
        headers: {"Content-Type": "application/json"},
        async: false,
        data: jsonExcludeSch,
        dataType: "json",
        success: function (res) {
            result = res;
        }
    })
    if(result != null){
        return "exist";
    }else{
        return null;
    }
}

function ownerCheck(schNo, schOwner) {
    let result;
    $.ajax({
        url:"/sch/selectOwner/",
        type:"post",
        headers: {"Content-Type":"application/json"},
        data: JSON.stringify({"schNo":schNo, "schOwner":schOwner}),
        async: false,
        dataType : "text",
        success: function(res){
            result = res;
        }
    })
    if(result != ""){
        return "exist";
    }else{
        return null;
    }
}

function oneScheduleExclude(schNo, taskMapKey) {
    let json = JSON.stringify({"schNo":schNo, "taskMapKey":taskMapKey});
    $.ajax({
        url: "/sch/insertExcludeSch/",
        type:"post",
        headers: {"Content-Type":"application/json"},
        async: false,
        data: json,
        dataType : "text",
        success: function(res){
            console.log(res);
        }
    })
}

function allScheduleDelete(schNo, schOwner) {
    let jsonSchedule = JSON.stringify({"schNo":schNo, "schOwner":schOwner});
    $.ajax({
        url: "/sch/deleteSch/",
        type: "delete",
        headers: {"Content-Type": "application/json"},
        async: false,
        data: jsonSchedule,
        dataType: "text",
        success: function (res) {
            if(res == 0){
                alert("본 일정의 작성자만 삭제가 가능합니다.");
                $('#btnOneSchDelCancel').trigger('click');
                $('#btnReSchDelCancel').trigger('click');
                return false;
            }else{
                let jsonSchParty = JSON.stringify({"schNo":schNo});
                $.ajax({
                    url: "/sch/deleteSchParty/",
                    type: "delete",
                    headers: {"Content-Type": "application/json"},
                    async: false,
                    data: jsonSchParty,
                    dataType: "text",
                    success: function (res) {
                    }
                })
            }
        }
    })
}

function notify(res, realTime) {
    let check = checkNotificationPromise();
    let options = {
        body: realTime+" "+res.schStartTime+", "+res.schLocation,
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

function startTime(taskMap) {

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
        // console.log(dateString);
        for(let i=0;i<Object.keys(taskMap).length;i++){
            let taskAlarmTime = Object.keys(taskMap)[i];
            let task = taskMap[taskAlarmTime];

            // 달력에 표시는 해당날짜에 표현되고, 알림은 1일전, 2일전, 1주전으로 알림 나타내기
            // taskMap의 키값을 바꾸면 달력 표시가 바뀜
            // dateString와 해당 일정의 하루, 이틀, 일주전의 날짜를 맞춰서 알림이 뜨게...-
            let beforeDayAlarm;
            if(task.schAlarm == "1일전" || task.schAlarm == "2일전"
                || task.schAlarm == "1주전" || task.schAlarm == "1일전오전9시"){
                beforeDayAlarm = alarmDate(task.schAlarm, taskAlarmTime)+" "+taskAlarmTime.slice(11, 21);
                if(dateString == beforeDayAlarm.slice(0, 19)){
                    notify(taskMap[taskAlarmTime], beforeDayAlarm.slice(0, 10));
                }
            }else{
                if(dateString == taskAlarmTime.slice(0, 19)){
                    notify(taskMap[taskAlarmTime], taskAlarmTime.slice(0, 10));
                }
            }
        }
    }, 1000);
}

function alarmDate(schAlarm, barDate) {
    //barDate = 2020-09-15 10:00:00 R
    let firstPoint = barDate.indexOf("-");
    let lastPoint = barDate.lastIndexOf("-");
    let year = barDate.slice(0,firstPoint);
    let month = barDate.slice(firstPoint+1,lastPoint);
    let date = barDate.slice(lastPoint+1,10);
    if(month.slice(0,1) === "0"){
        month = month.slice(1, 2);
    }
    if(date.slice(0,1) === "0"){
        date = date.slice(1, 2);
    }

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

function dateBarToDate(barDate) {
    let firstPoint = barDate.indexOf("-");
    let lastPoint = barDate.lastIndexOf("-");
    let year = Number(barDate.slice(0,firstPoint));
    let month = Number(barDate.slice(firstPoint+1,lastPoint));
    let date = Number(barDate.slice(lastPoint+1, 10));

    let newDate = new Date(year, month-1, date);

    return newDate;
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
    }else if (elementId == 'repeatMiniArrowLeft'){
        if(month == 1){
            month = 12;
            $("#repeatMiniMonth").text(month);
            year = year-1;
            $("#repeatMiniYear").text(year);
        }else{
            month = Number($("#repeatMiniMonth").text())-1;
            $("#repeatMiniMonth").text(month);
        }
    }else if(elementId == 'repeatMiniArrowRight'){
        if(month == 12){
            month = 1;
            $("#repeatMiniMonth").text(month);
            year = year+1;
            $("#repeatMiniYear").text(year);
        }else{
            month = Number($("#repeatMiniMonth").text())+1;
            $("#repeatMiniMonth").text(month);
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
    }else if(elementId == 'repeatMiniArrowLeft'|| elementId == 'repeatMiniArrowRight'||elementId=='repeatCal'){
        $.ajax({
            url:"/cal/"+year+"/"+month,
            type:"get",
            data: "json",
            success: function(res){
                for(let i=0;i<42;i++){

                    if(res[i].month < month ){
                        $(".miniRepeatDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenRepeatMonth'>" +
                            "<span class='miniRepeatPreMonth'>"+res[i].date+"</span>");
                    }else if(res[i].month > month){
                        $(".miniRepeatDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenRepeatMonth'>" +
                            "<span class='miniRepeatNextMonth'>"+res[i].date+"</span>");
                    }else{
                        $(".miniRepeatDate").eq(i).html("" +
                            "<input type='hidden' value='"+res[i].month+"' class='hiddenRepeatMonth'>" +
                            "<span class='miniRepeatLink' >"+res[i].date+"</span>");
                    }

                    $(".miniRepeatPreMonth").css("color","#ccc").css("cursor","pointer");
                    $(".miniRepeatNextMonth").css("color","#ccc").css("cursor","pointer");
                    $(".miniRepeatLink").css("cursor","pointer");
                }
            }
        })
    }
}