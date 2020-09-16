package com.neoulsoft.calendar.controller;

import com.neoulsoft.calendar.db.service.SchService;
import com.neoulsoft.calendar.vo.ExcludeSchVO;
import com.neoulsoft.calendar.vo.SchConditionVO;
import com.neoulsoft.calendar.vo.SchPartyVO;
import com.neoulsoft.calendar.vo.ScheduleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sch/*")
public class SchRestController {

    @Autowired
    private SchService schService;

    @RequestMapping(value = "/registerSch", method = RequestMethod.POST)
    public ResponseEntity<String> registerSch(@RequestBody ScheduleVO vo) {
        ResponseEntity<String> entity = null;

        try{
            schService.registerSch(vo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/updateSch", method = RequestMethod.PUT)
    public ResponseEntity<String> updateSch(@RequestBody ScheduleVO vo) {
        ResponseEntity<String> entity = null;

        try{
            schService.updateSch(vo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/lastSchNo", method = RequestMethod.GET)
    public ResponseEntity<String> lastSchNo() {
        ResponseEntity<String> entity = null;

        try{
            String schNo = schService.lastSchNo();
            entity = new ResponseEntity<>(schNo, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/registerSchParty", method = RequestMethod.POST)
    public ResponseEntity<String> registerSchParty(@RequestBody SchPartyVO vo) {
        ResponseEntity<String> entity = null;

        try{
            schService.registerSchParty(vo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/updateSchParty", method = RequestMethod.PUT)
    public ResponseEntity<String> updateSchParty(@RequestBody SchPartyVO vo) {
        ResponseEntity<String> entity = null;

        try{
            schService.deleteSchPartyMember(vo);
            schService.registerSchParty(vo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/listSchedule", method = RequestMethod.POST)
    public ResponseEntity<List<ScheduleVO>> listSchedule(@RequestBody SchConditionVO vo) {
        ResponseEntity<List<ScheduleVO>> entity = null;

        try{
            List<ScheduleVO> list = schService.listSchedule(vo);
            entity = new ResponseEntity<>(list, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/listRepeatSchedule", method = RequestMethod.POST)
    public ResponseEntity<List<ScheduleVO>> listRepeatSchedule(@RequestBody SchConditionVO vo) {
        ResponseEntity<List<ScheduleVO>> entity = null;

        try{
            List<ScheduleVO> list = schService.listRepeatSchedule(vo);
            entity = new ResponseEntity<>(list, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/selectSch", method = RequestMethod.POST)
    public ResponseEntity<ScheduleVO> selectSch(@RequestBody ScheduleVO vo) {
        ResponseEntity<ScheduleVO> entity = null;

        try{
            ScheduleVO sch = schService.selectSch(vo);
            entity = new ResponseEntity<>(sch, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/selectSchBySchAlarmTime", method = RequestMethod.POST)
    public ResponseEntity<ScheduleVO> selectSchBySchAlarmTime(@RequestBody ScheduleVO vo) {
        ResponseEntity<ScheduleVO> entity = null;

        try{
            ScheduleVO sch = schService.selectSchBySchAlarmTime(vo);
            entity = new ResponseEntity<>(sch, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/selectScheduleCheck", method = RequestMethod.POST)
    public ResponseEntity<SchPartyVO> selectScheduleCheck(@RequestBody SchPartyVO vo) {
        ResponseEntity<SchPartyVO> entity = null;

        try{
            SchPartyVO schParty = schService.selectScheduleCheck(vo);
            entity = new ResponseEntity<>(schParty, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/selectSchParty", method = RequestMethod.POST)
    public ResponseEntity<List<SchPartyVO>> selectSchParty(@RequestBody ScheduleVO vo) {
        ResponseEntity<List<SchPartyVO>> entity = null;

        try{
            List<SchPartyVO> list = schService.selectSchParty(vo);
            entity = new ResponseEntity<>(list, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/deleteSch", method = RequestMethod.DELETE)
    public ResponseEntity<Integer> deleteSch(@RequestBody ScheduleVO vo) {
        ResponseEntity<Integer> entity = null;
        int rst = 0;
        try{
             rst = schService.deleteSch(vo);
            entity = new ResponseEntity<>(rst, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(rst,HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/deleteSchParty", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteSchParty(@RequestBody SchPartyVO vo) {
        ResponseEntity<String> entity = null;

        try{
            schService.deleteSchParty(vo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/insertExcludeSch", method = RequestMethod.POST)
    public ResponseEntity<String> insertExcludeSch(@RequestBody ExcludeSchVO vo) {
        ResponseEntity<String> entity = null;

        try{
            schService.insertExcludeSch(vo);
            entity = new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/selectExcludeSch", method = RequestMethod.POST)
    public ResponseEntity<ExcludeSchVO> selectExcludeSch(@RequestBody ExcludeSchVO vo) {
        ResponseEntity<ExcludeSchVO> entity = null;

        try{
            ExcludeSchVO exSch = schService.selectExcludeSch(vo);
            entity = new ResponseEntity<>(exSch, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/updateSchRepeatDate", method = RequestMethod.PUT)
    public ResponseEntity<Integer> updateSchRepeatDate(@RequestBody ScheduleVO vo) {
        ResponseEntity<Integer> entity = null;
        int rst = 0;
        try{
            rst = schService.updateSchRepeatDate(vo);
            entity = new ResponseEntity<>(rst, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(rst,HttpStatus.BAD_REQUEST);
        }
        return entity;
    }

    @RequestMapping(value = "/selectOwner", method = RequestMethod.POST)
    public ResponseEntity<ScheduleVO> selectOwner(@RequestBody ScheduleVO vo) {
        ResponseEntity<ScheduleVO> entity = null;
        try{
            ScheduleVO sch = schService.selectOwner(vo);
            entity = new ResponseEntity<>(sch, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }
}
