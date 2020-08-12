package com.neoulsoft.calendar.controller;

import com.neoulsoft.calendar.db.service.EmpService;
import com.neoulsoft.calendar.util.SecurityUtil;
import com.neoulsoft.calendar.vo.EmployeeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/emp/*")
public class EmpRestController {
    @Autowired
    private EmpService empService;

    //아이디 중복 체크
    @RequestMapping(value = "/chkId", method = RequestMethod.POST)
    public ResponseEntity<String> selectId(@RequestBody EmployeeVO vo) {
        ResponseEntity<String> entity = null;

        try{
            String res = empService.selectEmpId(vo);
            entity = new ResponseEntity<>(res, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    // 직원 등록
    @RequestMapping(value = "/empRegister", method = RequestMethod.POST)
    public ResponseEntity<String> empRegister(@RequestBody EmployeeVO vo) {
        ResponseEntity<String> entity = null;

        try{
            //비번 암호화
            SecurityUtil securityUtil = new SecurityUtil();
            String changePw = vo.getEmpPw();
            String empPw = securityUtil.encryptSHA256(changePw);
            vo.setEmpPw(empPw);

            empService.insertEmp(vo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    //로그인
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<String> login(@RequestBody EmployeeVO vo) {
        ResponseEntity<String> entity = null;

        try{
            //비번 암호화
            SecurityUtil securityUtil = new SecurityUtil();
            String changePw = vo.getEmpPw();
            String empPw = securityUtil.encryptSHA256(changePw);
            vo.setEmpPw(empPw);

            String res = "";

            String resId = empService.selectEmpId(vo);
            if(resId != null){
                String resIdPw = empService.selectEmpIdPw(vo);
                if(resIdPw != null){
                    res = "SUCCESS";
                }else{
                    res = "noPw";
                }
            }else{
                res = "noId";
            }

            entity = new ResponseEntity<>(res, HttpStatus.OK);

        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    //부서별 직원 이름 검색
    @RequestMapping(value = "/searchEmpDept", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<List<EmployeeVO>> searchEmpDept(@RequestBody EmployeeVO vo) {
        ResponseEntity<List<EmployeeVO>> entity = null;

        try{
            List<EmployeeVO> list = empService.searchEmpDept(vo.getEmpDeptName());
            entity = new ResponseEntity<>(list, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    //id를 활용한 직원 이름 검색
    @RequestMapping(value = "/selectEmpName", method = RequestMethod.POST)
    public ResponseEntity<String> selectEmpName(@RequestBody EmployeeVO vo) {
        ResponseEntity<String> entity = null;

        try{
            String schEmpName = empService.selectEmpName(vo);
            entity = new ResponseEntity<>(schEmpName, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

}
