package com.neoulsoft.calendar.mapper;

import com.neoulsoft.calendar.dto.TodoDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TodoMapper {
    //조회
    List selectList(TodoDto todo) throws Exception;

    //추가
    void insertList(TodoDto todo) throws Exception;

    // 수정
    void updateList(TodoDto todo) throws Exception;

    //삭제
    void deleteList(TodoDto todo) throws Exception;
}
