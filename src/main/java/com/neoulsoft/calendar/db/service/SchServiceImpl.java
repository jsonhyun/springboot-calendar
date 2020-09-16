package com.neoulsoft.calendar.db.service;

import com.neoulsoft.calendar.db.mapper.SchMapper;
import com.neoulsoft.calendar.vo.ExcludeSchVO;
import com.neoulsoft.calendar.vo.SchConditionVO;
import com.neoulsoft.calendar.vo.SchPartyVO;
import com.neoulsoft.calendar.vo.ScheduleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchServiceImpl implements SchService {
    @Autowired
    private SchMapper schMapper;

    @Override
    public void registerSch(ScheduleVO vo) throws Exception {
        schMapper.registerSch(vo);
    }

    @Override
    public String lastSchNo() throws Exception {
        String no = schMapper.lastSchNo();
        return no;
    }

    @Override
    public void registerSchParty(SchPartyVO vo) throws Exception {
        schMapper.registerSchParty(vo);
    }

    @Override
    public List<ScheduleVO> listSchedule(SchConditionVO vo) throws Exception {
        List<ScheduleVO> list = schMapper.listSchedule(vo);
        return list;
    }

    @Override
    public List<ScheduleVO> listRepeatSchedule(SchConditionVO vo) throws Exception {
        List<ScheduleVO> list = schMapper.listRepeatSchedule(vo);
        return list;
    }

    @Override
    public ScheduleVO selectSch(ScheduleVO vo) throws Exception {
        ScheduleVO sch = schMapper.selectSch(vo);
        return sch;
    }

    @Override
    public int deleteSch(ScheduleVO vo) throws Exception {
        return schMapper.deleteSch(vo);
    }

    @Override
    public void deleteSchParty(SchPartyVO vo) throws Exception {
        schMapper.deleteSchParty(vo);
    }

    @Override
    public List<SchPartyVO> selectSchParty(ScheduleVO vo) throws Exception {
        List<SchPartyVO> list = schMapper.selectSchParty(vo);
        return list;
    }

    @Override
    public void updateSch(ScheduleVO vo) throws Exception {
        schMapper.updateSch(vo);
    }

    @Override
    public ScheduleVO selectSchBySchAlarmTime(ScheduleVO vo) throws Exception {
        ScheduleVO sch = schMapper.selectSchBySchAlarmTime(vo);
        return sch;
    }

    @Override
    public SchPartyVO selectScheduleCheck(SchPartyVO vo) throws Exception {
        SchPartyVO schParty = schMapper.selectScheduleCheck(vo);
        return schParty;
    }

    @Override
    public void deleteSchPartyMember(SchPartyVO vo) throws Exception {
        schMapper.deleteSchPartyMember(vo);
    }

    @Override
    public void insertExcludeSch(ExcludeSchVO vo) throws Exception {
        schMapper.insertExcludeSch(vo);
    }

    @Override
    public ExcludeSchVO selectExcludeSch(ExcludeSchVO vo) throws Exception {
        ExcludeSchVO exSch = schMapper.selectExcludeSch(vo);
        return exSch;
    }

    @Override
    public int updateSchRepeatDate(ScheduleVO vo) throws Exception {
        return schMapper.updateSchRepeatDate(vo);
    }

    @Override
    public ScheduleVO selectOwner(ScheduleVO vo) throws Exception {
        return schMapper.selectOwner(vo);
    }
}
