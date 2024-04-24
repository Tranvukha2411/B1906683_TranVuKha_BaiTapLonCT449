<script>
export default {
    props: {
        users: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
        updateActiveIndex(index) {
            this.$emit("update:activeIndex", index);
        }
    }
};
</script>
<template>
    <ul class="list-groups">
        <li class="list-group-items" v-for="(user, index) in users" :key="user._id"
            :class="{ active: index === activeIndex }" @click="updateActiveIndex(index)">
            {{ user.name }} 
        </li>
    </ul>
</template>
/*Biến user là biến có thể thay đổi được */
/* {{user.name}}  Hiển thị tên của user */
/*Ở đây biến index là mặc định của vue dùng để đếm trong thẻ li */
<style scoped>

    .list-groups{
        padding: 0;
        margin: 0;
    }
    .list-group-items{
        list-style: none;
        border-bottom: 3px solid rgb(91, 47, 5);
        cursor: pointer;
        font-weight: bold;
    }
    .list-group-items:hover{
        background-color: rgba(132, 211, 211, 0.471);
    }

    .active{
        background-color: rgba(132, 211, 211, 0.471);
    }
</style>