package com.neoulsoft.calendar.db.mapper;

import com.neoulsoft.calendar.vo.EmployeeVO;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface EmpMapper {
    //아이디 조회
    @Select(
            "SELECT empId " +
            "FROM employee " +
            "WHERE empId=#{empId}"
    )
    String selectEmpId(EmployeeVO vo) throws Exception;

    //직원 등록
    @Insert(
            "insert into employee " +
            "(empId, empPw, empName, empDeptName, empTitle, empBirth, empPhone, " +
            "empAddress, empDetailAddress, empEmail) values (#{empId}, #{empPw}," +
            "#{empName}, #{empDeptName}, #{empTitle}, #{empBirth}," +
            "#{empPhone}, #{empAddress}, #{empDetailAddress}, #{empEmail})"
    )
    void insertEmp(EmployeeVO vo) throws Exception;

    // 로그인 처리
    @Select(
            "SELECT empId " +
            "FROM employee " +
            "WHERE empId=#{empId} and empPw=#{empPw}"
    )
    String selectEmpIdPw(EmployeeVO vo) throws Exception;

    //사원 이름/직책 검색
    @Select(
            "SELECT * FROM employee WHERE empId = #{empId}"
    )
    EmployeeVO selectEmp(String empId) throws Exception;

    //부서별 사원 검색
    @Select(
            "SELECT empName " +
            "FROM employee " +
            "WHERE empDeptName=#{empDeptName}"
    )
    List<EmployeeVO> searchEmpDept(String empDeptName) throws Exception;

    @Select(
            "select empName " +
                    "from employee " +
                    "where empId = #{empId}"
    )
    String selectEmpName(EmployeeVO vo) throws Exception;
}