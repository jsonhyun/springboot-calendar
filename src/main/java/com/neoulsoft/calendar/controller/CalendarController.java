package com.neoulsoft.calendar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Controller
public class CalendarController {

    @GetMapping("/cal")
    private String cal(Model model) {
        Calendar now = Calendar.getInstance();
        int year = now.get(Calendar.YEAR);
//        now.set(Calendar.MONTH, 1);
        int month = now.get(Calendar.MONTH) + 1;

        model.addAttribute("year", year);
        model.addAttribute("month", month);

        now.set(Calendar.DATE, 1);
        int day = now.get(Calendar.DAY_OF_WEEK) - 1;
        now.add(Calendar.DATE, day * (-1));

        List<Integer> months = new ArrayList<>();
        List<Integer> dates = new ArrayList<>();
        for (int i = 1; i < 43; i++) {
            months.add(now.get(Calendar.MONTH)+1);
            dates.add(now.get(Calendar.DATE));
            now.add(Calendar.DATE, 1);
        }

        model.addAttribute("months", months);
        model.addAttribute("dates", dates);

        return "calendar";
    }

    @GetMapping("/changeCal")
    private String changeCal(@RequestParam("month") int preMonth, @RequestParam("year") int preYear, Model model){

        Calendar cal = Calendar.getInstance();
        cal.set(preYear,preMonth-1, 1);

        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;

        model.addAttribute("year", year);
        model.addAttribute("month", month);

        cal.set(Calendar.DATE, 1);
        int day = cal.get(Calendar.DAY_OF_WEEK) - 1;
        cal.add(Calendar.DATE, day * (-1));

        List<Integer> months = new ArrayList<>();
        List<Integer> dates = new ArrayList<>();

        for (int i = 1; i < 43; i++) {
            months.add(cal.get(Calendar.MONTH)+1);
            dates.add(cal.get(Calendar.DATE));
            cal.add(Calendar.DATE, 1);
        }
        model.addAttribute("months", months);
        model.addAttribute("dates", dates);

        return "calendar";
    }

    @RequestMapping(value = "/testpage")
    public ModelAndView pageTest() {
        ModelAndView mav = new ModelAndView("testpage");
        return mav;
    }
}
