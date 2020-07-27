package com.neoulsoft.calendar.vo;

public class CalVO {
    private int year;
    private int month;
    private int date;

    public CalVO() {
    }

    public CalVO(int year, int month, int date) {
        this.year = year;
        this.month = month;
        this.date = date;
    }

    public CalVO(int month, int date) {
        this.month = month;
        this.date = date;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDate() {
        return date;
    }

    public void setDate(int date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "CalVO{" +
                "year=" + year +
                ", month=" + month +
                ", date=" + date +
                '}';
    }
}