package com.neoulsoft.calendar.db.service;

import com.neoulsoft.calendar.db.mapper.EmpMapper;
import com.neoulsoft.calendar.vo.EmployeeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpServiceImpl implements EmpService{

    @Autowired
    private EmpMapper empMapper;

    @Override
    public String selectEmpId(EmployeeVO vo) throws Exception {
        String res = empMapper.selectEmpId(vo);
        return res;
    }

    @Override
    public void insertEmp(EmployeeVO vo) throws Exception {
        empMapper.insertEmp(vo);
    }

    @Override
    public String selectEmpIdPw(EmployeeVO vo) throws Exception {
        String res = empMapper.selectEmpIdPw(vo);
        return res;
    }

    @Override
    public EmployeeVO selectEmp(String empId) throws Exception {
        EmployeeVO vo = empMapper.selectEmp(empId);
        return vo;
    }

    @Override
    public List<EmployeeVO> searchEmpDept(String empDeptName) throws Exception {
        List<EmployeeVO> list = empMapper.searchEmpDept(empDeptName);
        return list;
    }

    @Override
    public String selectEmpName(EmployeeVO vo) throws Exception {
        String empName = empMapper.selectEmpName(vo);
        return empName;
    }
}
