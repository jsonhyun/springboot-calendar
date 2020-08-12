$(function () {

    //아이디 체크
    $("input[name='empId']").on("blur", function () {
        let empId = $("input[name='empId']").val();

        if (empId == ""){
            $("#divId").children(".alertText").html("필수 정보입니다.")
                .css("display", "block")
                .css("color", "red");
        }else if(!isId(empId)) {
            $("#divId").children(".alertText").html("아이디는 4~20자 영문 소문자, 숫자만 사용가능합니다.")
                .css("display", "block")
                .css("color", "red");
        }else{
            let json = JSON.stringify({"empId":empId});
            $.ajax({
                url:"/emp/chkId/",
                type:"post",
                headers: {"Content-Type":"application/json"},
                data: json,
                dataType : "text",
                success: function(res){
                    if(res == empId){
                        $("#divId").children(".alertText").html("이미 사용중인 아이디입니다.")
                            .css("display", "block")
                            .css("color", "red");
                    }else{
                        $("#divId").children(".alertText").html("사용가능한 아이디입니다.")
                            .css("display", "block")
                            .css("color", "green");
                    }
                }
            })
        }
    })

    //비밀번호 체크
    $("input[name='empPw']").on("blur", function () {
        let empPw = $("input[name='empPw']").val();

        if (empPw == ""){
            $("#divPw").children(".alertText").html("필수 정보입니다.")
                .css("display", "block")
                .css("color", "red");
        }else if(!isPw(empPw)) {
            $("#divPw").children(".alertText").html("비밀번호는 숫자 또는 특수문자를 포함한 8~20자 영문만 사용가능합니다.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divPw").children(".alertText").html("사용가능한 비밀번호입니다.")
                .css("display", "block")
                .css("color", "green");
        }
    })

    //비밀번호 확인
    $("input[name='empPwConfirm']").on("blur", function () {
        let empPw = $("input[name='empPw']").val();
        let empPwConfirm = $("input[name='empPwConfirm']").val();

        if (empPwConfirm == empPw){
            $("#divPwConfirm").children(".alertText").html("비밀번호가 일치합니다.")
                .css("display", "block")
                .css("color", "green");
        }else{
            $("#divPwConfirm").children(".alertText").html("비밀번호를 다시 확인해주세요.")
                .css("display", "block")
                .css("color", "red");
        }
    })

    //이름 확인
    $("input[name='empName']").on("blur", function () {
        let empName = $("input[name='empName']").val();

        if (!isEmpName(empName)){
            $("#divName").children(".alertText").html("2~6자 한글을 사용하세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divName").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //부서 선택
    $("#empDeptName").on("blur change", function () {
        let empDeptName = $("#empDeptName").val();

        if (empDeptName == "선택"){
            $("#divDeptName").children(".alertText").html("부서를 선택해주세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divDeptName").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //직책 선택
    $("#empTitle").on("blur change", function () {
        let empTitle = $("#empTitle").val();

        if (empTitle == "선택"){
            $("#divTitle").children(".alertText").html("직무(직책)을 선택해주세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divTitle").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //생년월일 체크(연)
    $("input[name='empBirthYear']").on("blur", function () {
        let empBirthYear = $("input[name='empBirthYear']").val();

        if (!isBirthYear(empBirthYear)){
            $("#divBirth").children(".alertText").html("태어난 년도 4자리를 정확하게 입력해주세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divBirth").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //생년월일 생성(월)
    for(let i=1;i<13;i++){
        $("#empBirthMonth").append(" <option value='"+i+"'>"+i+"</option>");
    }

    //생년월일 체크(월)
    $("#empBirthMonth").on("blur change", function () {
        let empBirthMonth = $("#empBirthMonth").val();

        if (empBirthMonth == "월"){
            $("#divBirth").children(".alertText").html("태어난 월을 선택해주세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divBirth").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //생년월일 체크(일)
    $("input[name='empBirthDate']").on("blur", function () {
        let empBirthDate = $("input[name='empBirthDate']").val();

        if (!isBirthDate(empBirthDate)){
            $("#divBirth").children(".alertText").html("태어난 일을 2자리로 정확하게 입력해주세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divBirth").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //전화번호 체크
    $("input[name='empPhone']").on("blur", function () {
        let empPhone = $("input[name='empPhone']").val();

        if (empPhone == ""){
            $("#divPhone").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }else if(!isEmpPhone(empPhone)){
            $("#divPhone").children(".alertText").html("'000-0000-0000'로 정확하게 입력해주세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divPhone").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //주소 검색
    $("#btnSearchAddress").on("click", function () {
        Postcode();
    })

    //이메일 체크
    $("input[name='empEmail']").on("blur", function () {
        let empEmail = $("input[name='empEmail']").val();

        if (!isEmpEmail(empEmail)){
            $("#divEmail").children(".alertText").html("이메일을 정확하게 입력해주세요.")
                .css("display", "block")
                .css("color", "red");
        }else{
            $("#divEmail").children(".alertText").html("")
                .css("display", "none")
                .css("color", "white");
        }
    })

    //회원가입 클릭시
    $("#btnAddEmp").on("click", function () {
        //빨간 경고메시지 출력 여부확인
        let alertArr = $(".alertText").get();
        for (let i=0;i<alertArr.length;i++){
            let warning = $(".alertText").get(i);
            if(warning.style.color == "red"){
                alert("입력사항을 다시 확인해주세요.");
                return false;
            }
        }

        let empId = $("input[name='empId']").val();
        let empPw = $("input[name='empPw']").val();
        let empPwConfirm = $("input[name='empPwConfirm']").val();
        let empName = $("input[name='empName']").val();
        let empDeptName = $("#empDeptName").val();
        let empTitle = $("#empTitle").val();
        let empBirthYear = $("input[name='empBirthYear']").val();
        let empBirthMonth = $("#empBirthMonth").val();
        let empBirthDate = $("input[name='empBirthDate']").val();
        let empPhone = $("input[name='empPhone']").val();
        let empAddress = $("input[name='empAddress']").val();
        let empDetailAddress = $("input[name='empDetailAddress']").val();
        let empEmail = $("input[name='empEmail']").val();

        // 입력 폼에 공란 여부 확인
        if(empId == "" || empPw=="" || empPwConfirm=="" || empName=="" || empDeptName=="선택" || empTitle=="선택"
            || empBirthYear=="" || empBirthMonth=="월" || empBirthDate=="" || empEmail==""){
            alert("필수 입력사항을 모두 입력해주세요.");
        }

        //생년월일
        let empBirth = getEmpBirth (empBirthYear, empBirthMonth-1, empBirthDate);

        //직원 등록
        let json = JSON.stringify({"empId":empId, "empPw":empPw, "empName":empName, "empDeptName":empDeptName,
            "empTitle":empTitle, "empBirth":empBirth, "empPhone":empPhone, "empAddress":empAddress,
            "empDetailAddress":empDetailAddress, "empEmail":empEmail});
        $.ajax({
            url:"/emp/empRegister/",
            type:"post",
            headers: {"Content-Type":"application/json"},
            data: json,
            dataType : "text",
            success: function(res){
                console.log(res);
                alert("직원등록이 완료되었습니다. 로그인화면으로 이동합니다.");
                location.href = "/page/index";
            }
        })
    })
})

function isId(asValue) {
    let regExp = /^[a-z0-9]{4,20}$/; //  4 ~ 20자 영문, 숫자 조합
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

function isPw(asValue) {
    let regExp = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/; //  8 ~ 20자 영문(대소문자), 숫자 또는 특수문자 1개이상 포함
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

function isEmpName(asValue) {
    let regExp = /^[가-힣]{2,6}$/; //  2 ~ 6자 한글
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

function isBirthYear(asValue) {
    let regExp = /^[0-9]{4}$/; //  4자 숫자
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

function isBirthDate(asValue) {
    let regExp = /^[0-2]{1}[1-9]{1}$|^10$|^20$|^30$|^31$/; //  0~31까지 2자리 숫자
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

function isEmpPhone(asValue) {
    let regExp = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/; //  000-0000-0000의 전화번호 형식
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

function isEmpEmail(asValue) {
    let regExp = /^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/; //  이메일 형식
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
}

function Postcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            let addr = ''; // 주소 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            $("input[name='empAddress']").val(addr);
            // 커서를 상세주소 필드로 이동한다.
            $("input[name='empDetailAddress']").focus();
        }
    }).open();
}

function getEmpBirth (year, month, date){
    let empBirth = new Date(year, month, date);
    let yyyy = empBirth.getFullYear().toString();
    let MM = (empBirth.getMonth()+1).toString();
    let dd = empBirth.getDate().toString();
    return yyyy + "-" + (MM[1] ? MM : "0" + MM[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
}

