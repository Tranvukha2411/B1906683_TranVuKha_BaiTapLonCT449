<template>
    <Form @submit="submitUser">

        <div class="input-section">
            <Field name="email" type="email" class="form-control" v-model="userLocal.email" placeholder="Nhập emai" />
            <i class="fa-regular fa-envelope icon-letter"></i>
        </div>
        
        <div class="input-section">
            <Field name="password" type="password" class="form-control" id="passWord" v-model="userLocal.password"
                placeholder="Nhập mật khẩu" /> 
                <i class="fa-solid fa-lock icon-lock"></i>
        </div>
        <div class="show-password">
            <i class="fa-regular fa-eye" @click="showPassword" v-if="!showpass"></i>
            <i class="fa-regular fa-eye-slash" @click="showPassword" v-if="showpass"></i>
        </div>
        <!-- <p id="forgot-password">Quên mật khẩu</p> -->
        <div class="form-group">
            <button class="btn btn-primary">Đăng nhập</button>
        </div>
    </Form>

    <!-- Quên mật khẩu -->
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import bookstoreService from "../services/bookstore.service";
import * as yup from "yup";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:users"],
    props: {
        users: { type: Object, require: true },
    },
    data() {
        return {
            userLocal: this.users,
            showpass: false,
        };
    },
    methods: {
        submitUser() {
            // for(let i = 0; i < this.listUser.length; i++) {
            //     if(this.userLocal.email == this.listUser[i].email && this.userLocal.password == this.listUser[i].password){
            //         alert("Đăng nhập thành công");
            //         this.$emit("submit:user",this.userLocal);
            //     } else return;
            // }
            this.$emit("submit:users", this.userLocal);

        },
        showPassword() {
            const PassInput = document.getElementById('passWord');
            if (PassInput.type === "password") {
                this.showpass = true;
                PassInput.type = "text";
            } else {
                this.showpass = false;
                PassInput.type = 'password';
            }

        },
    },

}
</script>

<style scoped>
.form-control {
    border: none;
    outline: none;
}

.input-section{
    width: 250px;
    border-bottom: 2px solid;
    margin: 10px 0;
    & i{
        position: absolute;
        right: 20%;
    }
}
.icon-lock{
    top: 47%;
}
.icon-letter{
    top: 26%;
}

.show-password {
    position: relative;
    font-size: 20px;
    right: -160px;
    top: -43px;
}

</style>