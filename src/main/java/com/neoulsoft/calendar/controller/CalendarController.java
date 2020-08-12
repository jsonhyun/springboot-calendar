package com.neoulsoft.calendar.controller;

import com.neoulsoft.calendar.db.service.EmpService;
import com.neoulsoft.calendar.vo.EmployeeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Controller
@RequestMapping("/page")
public class CalendarController {

    @Autowired
    private EmpService empService;

    @RequestMapping(value = "/index")
    public ModelAndView index() {
        ModelAndView mav = new ModelAndView("page/index");
        return mav;
    }

    @RequestMapping(value = "/join")
    public ModelAndView join() {
        ModelAndView mav = new ModelAndView("page/join");
        return mav;
    }

    @RequestMapping("/calendar")
    private ModelAndView cal(Model model, HttpSession session, @RequestParam("empId") String empId, @RequestParam("year") int year, @RequestParam("month") int month ) throws Exception {
        ModelAndView mav = new ModelAndView("page/calendar");

        //달력 생성
        Calendar now = Calendar.getInstance();
        now.set(year,month-1, 1);
        int nowYear = now.get(Calendar.YEAR);
        int nowMonth = now.get(Calendar.MONTH) + 1;

        model.addAttribute("year", nowYear);
        model.addAttribute("month", nowMonth);

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

        //접속자 현황 검색
        EmployeeVO emp = empService.selectEmp(empId);
        session.setAttribute("Auth", empId);
        model.addAttribute("emp", emp);
        model.addAttribute("months", months);
        model.addAttribute("dates", dates);

        return mav;
    }

    @RequestMapping(value = "/logout")
    public ModelAndView logout(HttpSession session) {
        session.invalidate();
        ModelAndView mav = new ModelAndView("page/index");
        return mav;
    }
}
