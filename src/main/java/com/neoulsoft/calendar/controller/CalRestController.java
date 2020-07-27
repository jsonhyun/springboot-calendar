package com.neoulsoft.calendar.controller;

import com.neoulsoft.calendar.vo.CalVO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/cal/*")
public class CalRestController {

    @RequestMapping(value = "/{year}/{month}", method = RequestMethod.GET)
    public ResponseEntity<List<CalVO>> changeCalendar(@PathVariable("year") int year, @PathVariable("month") int month) {
        ResponseEntity<List<CalVO>> entity = null;

        try{
            Calendar cal = Calendar.getInstance();
            cal.set(year, month-1, 1);

            cal.set(Calendar.DATE, 1);
            int day = cal.get(Calendar.DAY_OF_WEEK) - 1;
            cal.add(Calendar.DATE, day * (-1));

            List<Integer> dateList = new ArrayList<>();
            List<Integer> monthList = new ArrayList<>();

            for (int i = 1; i < 43; i++) {
                monthList.add(cal.get(Calendar.MONTH)+1);
                dateList.add(cal.get(Calendar.DATE));
                cal.add(Calendar.DATE, 1);
            }
            List<CalVO> dates = new ArrayList<>();

            for (int i = 0; i < 42; i++) {
                CalVO vo = new CalVO();
                vo.setMonth(monthList.get(i));
                vo.setDate(dateList.get(i));
                dates.add(vo);
            }
            entity = new ResponseEntity<>(dates, HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            entity = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return entity;
    }
}
