package com.neoulsoft.calendar.db.service;

import com.neoulsoft.calendar.vo.EmployeeVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmpService {

    String selectEmpId(EmployeeVO vo) throws Exception;

    void insertEmp(EmployeeVO vo) throws Exception;

    String selectEmpIdPw(EmployeeVO vo) throws Exception;

    EmployeeVO selectEmp(String empId) throws Exception;

    List<EmployeeVO> searchEmpDept(String empDeptName) throws Exception;

    String selectEmpName(EmployeeVO vo) throws Exception;
}
