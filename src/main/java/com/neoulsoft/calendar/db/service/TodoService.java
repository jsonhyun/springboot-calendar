package com.neoulsoft.calendar.db.service;

import com.neoulsoft.calendar.vo.TodoVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TodoService {
    //조회
    List selectList(TodoVO todo) throws Exception;

    //추가
    void insertList(TodoVO todo) throws Exception;

    //수정
    void updateList(TodoVO todo) throws Exception;

    //삭제
    void deleteList(TodoVO todo) throws Exception;

    //한일 체크
    void updateCheck(TodoVO todo) throws Exception;

    //체크 삭제
    void updateNoCheck(TodoVO todo) throws Exception;
}
