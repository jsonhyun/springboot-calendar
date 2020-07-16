package com.neoulsoft.calendar.db.mapper;

import com.neoulsoft.calendar.vo.TodoVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TodoMapper {
    //조회
    @Select({
            "<script>" +
                    "SELECT tmonth, tdate, tchk, tindex, tcontent " +
                    "FROM todo " +
                    "WHERE tmonth=#{tMonth} and tdate=#{tDate}" +
            "</script>"
    })
    List<TodoVO> selectList(TodoVO todo) throws Exception;

    //추가
    @Insert({
            "<script>" +
                    "INSERT INTO todo " +
                    "(tmonth, tdate, tindex,tcontent) " +
                    "values (#{tMonth}, #{tDate}, #{tIndex}, #{tContent})" +
            "</script>"
    })
    void insertList(TodoVO todo) throws Exception;

    // 수정
    @Update({
            "<script>" +
                    "UPDATE todo " +
                    "SET tcontent=#{tContent} " +
                    "WHERE tmonth=#{tMonth} and tdate=#{tDate} and tindex=#{tIndex}" +
            "</script>"
    })
    void updateList(TodoVO todo) throws Exception;

    //삭제
    @Delete({
            "<script>" +
                    "DELETE FROM todo " +
                    "WHERE tmonth=#{tMonth} and tdate=#{tDate} and tcontent=#{tContent}" +
            "</script>"
    })
    void deleteList(TodoVO todo) throws Exception;

    //한일 체크
    @Update({
            "<script>" +
                    "UPDATE todo " +
                    "SET tchk=1 " +
                    "WHERE tmonth=#{tMonth} and tdate=#{tDate} and tcontent=#{tContent}" +
            "</script>"
    })
    void updateCheck(TodoVO todo) throws Exception;

    //체크 삭제
    @Update({
            "<script>" +
                    "UPDATE todo " +
                    "SET tchk=0 " +
                    "WHERE tmonth=#{tMonth} and tdate=#{tDate} and tcontent=#{tContent}" +
            "</script>"
    })
    void updateNoCheck(TodoVO todo) throws Exception;
}
