package me.gistory.newbies_server_24.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "users")
class User(
    @Column(unique = true)
    val email: String,
    val password: String,
){
    @Id @GeneratedValue val id: UUID = UUID.randomUUID()
}
