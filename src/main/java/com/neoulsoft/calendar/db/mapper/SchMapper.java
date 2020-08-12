package com.neoulsoft.calendar.db.mapper;

import com.neoulsoft.calendar.vo.SchConditionVO;
import com.neoulsoft.calendar.vo.SchPartyVO;
import com.neoulsoft.calendar.vo.ScheduleVO;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.rmi.server.ExportException;
import java.util.List;

@Mapper
@Repository
public interface SchMapper {
    @Insert(
            "insert into schedule (schOwner, schTitle, schStartDate, schEndDate, schStartTime, schEndTime, " +
                    "schCalName, schLocation, schRepeat, schAlarm, schAlarmTime, schExplain) values " +
                    "(#{schOwner}, #{schTitle}, #{schStartDate}, #{schEndDate}, #{schStartTime}, #{schEndTime}, #{schCalName}," +
                    " #{schLocation}, #{schRepeat}, #{schAlarm}, #{schAlarmTime}, #{schExplain})"
    )
    void registerSch(ScheduleVO vo) throws Exception;

    @Select(
            "select auto_increment " +
                    "from information_schema.tables " +
                    "where table_name = 'schedule' and table_schema = DATABASE()"
    )
    String lastSchNo() throws Exception;

    @Insert(
            "insert into schparty values (#{schNo}, #{schEmpName})"
    )
    void registerSchParty(SchPartyVO vo) throws Exception;

    @Select(
            "select * " +
                    "from schedule sch left join schparty sp on sch.schNo = sp.schNo " +
                    "where sp.schEmpName = #{schEmpName} " +
                    "and sch.schStartDate between #{startDate} and #{endDate}"
    )
    List<ScheduleVO> listSchedule(SchConditionVO vo) throws Exception;

    @Select(
            "select * " +
                    "from schedule " +
                    "where schNo = #{schNo}"
    )
    ScheduleVO selectSch(ScheduleVO vo) throws Exception;

    @Delete(
            "delete from schedule where schNo = #{schNo} and schOwner = #{schOwner}"
    )
    int deleteSch(ScheduleVO vo) throws Exception;

    @Delete(
            "delete from schparty where schNo = #{schNo}"
    )
    void deleteSchParty(SchPartyVO vo) throws Exception;

    @Select(
            "select * from schparty where schNo = #{schNo}"
    )
    List<SchPartyVO> selectSchParty(ScheduleVO vo) throws Exception;

    @Update(
            "update schedule " +
                    "set schOwner=#{schOwner},schTitle=#{schTitle},schStartDate=#{schStartDate},schEndDate=#{schEndDate}," +
                    "schStartTime=#{schStartTime},schEndTime=#{schEndTime},schCalName=#{schCalName},schLocation=#{schLocation}," +
                    "schRepeat=#{schRepeat},schAlarm=#{schAlarm},schAlarmTime=#{schAlarmTime},schExplain=#{schExplain} where schNo=#{schNo}"
    )
    void updateSch(ScheduleVO vo) throws Exception;

    @Select(
            "select * from schedule where schAlarmTime = #{schAlarmTime}"
    )
    ScheduleVO selectSchBySchAlarmTime(ScheduleVO vo) throws Exception;

    @Select(
            "select * from schparty where schNo = #{schNo} and schEmpName = #{schEmpName}"
    )
    SchPartyVO selectScheduleCheck(SchPartyVO vo) throws Exception;
}
