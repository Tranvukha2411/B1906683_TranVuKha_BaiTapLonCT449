<script>
    export default{
        props: {
            user: {type: Object, required: true},
        },
    }
</script>

<template>
    <div class="user-profile">
        <div class="p-1 avatar-profile rounded-circle">
            <img :src="user.avatar" alt="" class="rounded-circle">
        </div>
        <div class="p-1">
            <strong>Tên: </strong>
            {{ user.name }}
        </div>
        <div class="p-1">
            <strong>Email: </strong>
            {{ user.email }}
        </div>
        <div class="p-1">
            <strong>Địa chỉ: </strong>
            {{ user.address }}
        </div>
        <div class="p-1">
            <strong>Số điện thoại: </strong>
            {{ user.phone }}
        </div>
    </div>
</template>

<style scoped>
    .avatar-profile{
        width: 100px;
        height: 100px;

        & img{
            width: 100%;
            height: 100%;
            border:1px solid;
        }
}
</style>