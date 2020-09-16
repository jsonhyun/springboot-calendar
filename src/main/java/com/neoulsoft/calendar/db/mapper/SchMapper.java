package com.neoulsoft.calendar.db.mapper;

import com.neoulsoft.calendar.vo.ExcludeSchVO;
import com.neoulsoft.calendar.vo.SchConditionVO;
import com.neoulsoft.calendar.vo.SchPartyVO;
import com.neoulsoft.calendar.vo.ScheduleVO;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import javax.websocket.server.ServerEndpoint;
import java.rmi.server.ExportException;
import java.util.List;

@Mapper
@Repository
public interface SchMapper {
    @Insert(
            "insert into schedule (schOwner, schTitle, schStartDate, schEndDate, schStartTime, schEndTime, " +
                    "schCalName, schLocation, schRepeat, schRepeatDate, schAlarm, schAlarmTime, schExplain) values " +
                    "(#{schOwner}, #{schTitle}, #{schStartDate}, #{schEndDate}, #{schStartTime}, #{schEndTime}, #{schCalName}," +
                    " #{schLocation}, #{schRepeat}, #{schRepeatDate}, #{schAlarm}, #{schAlarmTime}, #{schExplain})"
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
                    "where sp.schEmpName = #{schEmpName} "
//                    "and sch.schStartDate between #{startDate} and #{endDate}" +
//                    "or sch.schRepeatDate between #{startDate} and #{endDate}"
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
                    "schRepeat=#{schRepeat},schRepeatDate=#{schRepeatDate},schAlarm=#{schAlarm},schAlarmTime=#{schAlarmTime}," +
                    "schExplain=#{schExplain} where schNo=#{schNo}"
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

    @Select(
            "select * " +
                    "from schedule sch left join schparty sp on sch.schNo = sp.schNo " +
                    "where sch.schRepeat not like '반복안함' and sp.schEmpName = #{schEmpName}"
    )
    List<ScheduleVO> listRepeatSchedule(SchConditionVO vo) throws Exception;

    @Delete(
            "delete from schparty where schNo = #{schNo} and schEmpName = #{schEmpName}"
    )
    void deleteSchPartyMember(SchPartyVO vo) throws Exception;

    @Insert(
            "insert into excludesch values (#{schNo}, #{taskMapKey})"
    )
    void insertExcludeSch(ExcludeSchVO vo) throws Exception;

    @Select(
            "select * " +
                    "from excludesch exsch left join schparty sp on exsch.schNo = sp.schNo " +
                    "where exsch.taskMapKey = #{taskMapKey} and sp.schEmpName = #{schEmpName}"
    )
    ExcludeSchVO selectExcludeSch(ExcludeSchVO vo) throws Exception;

    @Update(
            "update schedule " +
                    "set schRepeatDate = #{schRepeatDate}" +
                    "where schNo=#{schNo} and schOwner=#{schOwner}"
    )
    int updateSchRepeatDate(ScheduleVO vo) throws Exception;

    @Select(
            "select * from schedule where schNo=#{schNo} and schOwner=#{schOwner}"
    )
    ScheduleVO selectOwner(ScheduleVO vo) throws Exception;
}
