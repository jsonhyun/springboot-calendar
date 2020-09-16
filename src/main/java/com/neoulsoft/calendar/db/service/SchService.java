package com.neoulsoft.calendar.db.service;

import com.neoulsoft.calendar.vo.ExcludeSchVO;
import com.neoulsoft.calendar.vo.SchConditionVO;
import com.neoulsoft.calendar.vo.SchPartyVO;
import com.neoulsoft.calendar.vo.ScheduleVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SchService {

    void registerSch(ScheduleVO vo) throws Exception;

    String lastSchNo() throws Exception;

    void registerSchParty(SchPartyVO vo) throws Exception;

    List<ScheduleVO> listSchedule(SchConditionVO vo) throws Exception;

    List<ScheduleVO> listRepeatSchedule(SchConditionVO vo) throws Exception;

    ScheduleVO selectSch(ScheduleVO vo) throws Exception;

    int deleteSch(ScheduleVO vo) throws Exception;

    void deleteSchParty(SchPartyVO vo) throws Exception;

    List<SchPartyVO> selectSchParty(ScheduleVO vo) throws Exception;

    void updateSch(ScheduleVO vo) throws Exception;

    ScheduleVO selectSchBySchAlarmTime(ScheduleVO vo) throws Exception;

    SchPartyVO selectScheduleCheck(SchPartyVO vo) throws Exception;

    void deleteSchPartyMember(SchPartyVO vo) throws Exception;

    void insertExcludeSch(ExcludeSchVO vo) throws Exception;

    ExcludeSchVO selectExcludeSch(ExcludeSchVO vo) throws Exception;

    int updateSchRepeatDate(ScheduleVO vo) throws Exception;

    ScheduleVO selectOwner(ScheduleVO vo) throws Exception;
}
