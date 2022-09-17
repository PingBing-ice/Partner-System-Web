<template>
  <van-card v-for="user in props.userList"
            :desc="user.profile"
            :title="user.userAccount"
            :thumb="user.avatarUrl"
  >
    <template #tags>
      <van-tag plain style="margin-right: 8px; margin-top: 8px;color: #42b983" type="danger" v-for="tag in user.tags">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="mini" @click="sendFriendRequest(user.id)">添加好友</van-button>
    </template>

  </van-card>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {TeamType} from "../models/team";

interface UserCardListType{
  userList: UserType[];
}
const props=withDefaults(defineProps<UserCardListType>(),{
  // @ts-ignore
  userList: [] as TeamType[],
})
const sendFriendRequest = async (id:string) => {
  const res = await myAxios.get("/partner/friend/userFriend/friendUser", {
    params: {
      toUserId: id,
    }
  })
  // @ts-ignore
  if (res.code == 200) {
    Toast.success("添加成功")
  }else {
    // @ts-ignore
    Toast.fail(res.description)
  }
}

</script>

<style scoped>

</style>
