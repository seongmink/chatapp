package com.seongmink.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String> {

    @Query("{sender: ?0, receiver: ?1}")
    Flux<Chat> mFindBySender(String sender, String receiver);
}
