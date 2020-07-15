package com.neoulsoft.calendar.persistence;

import com.neoulsoft.calendar.dto.TodoDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TodoService {
    //조회
    List selectList(TodoDto todo) throws Exception;

    //추가
    void insertList(TodoDto todo) throws Exception;

    //수정
    void updateList(TodoDto todo) throws Exception;

    //삭제
    void deleteList(TodoDto todo) throws Exception;

    //한일 체크
    void updateCheck(TodoDto todo) throws Exception;

    //체크 삭제
    void updateNoCheck(TodoDto todo) throws Exception;
}
