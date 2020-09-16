package com.neoulsoft.calendar.vo;

import lombok.Data;

import java.util.Date;

@Data
public class ScheduleVO {
    private int schNo;
    private String schOwner;
    private String schCalName;
    private String schTitle;
    private String schStartDate;
    private String schEndDate;
    private String schStartTime;
    private String schEndTime;
    private String schLocation;
    private String schRepeat;
    private String schRepeatDate;
    private String schAlarm;
    private String schAlarmTime;
    private String schExplain;
}
