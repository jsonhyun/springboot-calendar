package com.neoulsoft.calendar.vo;

public class TodoVO {
    private int tNo;
    private int tMonth;
    private int tDate;
    private int tChk;
    private int tIndex;
    private String tContent;

    public TodoVO() {
    }

    public TodoVO(int tNo, int tMonth, int tDate, int tChk, int tIndex, String tContent) {
        this.tNo = tNo;
        this.tMonth = tMonth;
        this.tDate = tDate;
        this.tChk = tChk;
        this.tIndex = tIndex;
        this.tContent = tContent;
    }

    public int gettNo() {
        return tNo;
    }

    public void settNo(int tNo) {
        this.tNo = tNo;
    }

    public int gettMonth() {
        return tMonth;
    }

    public void settMonth(int tMonth) {
        this.tMonth = tMonth;
    }

    public int gettDate() {
        return tDate;
    }

    public void settDate(int tDate) {
        this.tDate = tDate;
    }

    public int gettChk() {
        return tChk;
    }

    public void settChk(int tChk) {
        this.tChk = tChk;
    }

    public int gettIndex() {
        return tIndex;
    }

    public void settIndex(int tIndex) {
        this.tIndex = tIndex;
    }

    public String gettContent() {
        return tContent;
    }

    public void settContent(String tContent) {
        this.tContent = tContent;
    }

    @Override
    public String toString() {
        return "TodoDto{" +
                "tNo=" + tNo +
                ", tMonth=" + tMonth +
                ", tDate=" + tDate +
                ", tChk=" + tChk +
                ", tIndex=" + tIndex +
                ", tContent='" + tContent + '\'' +
                '}';
    }
}





