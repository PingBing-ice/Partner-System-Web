<template>
  <van-card v-if="props.userList&& props.userList.length>0" v-for="user in props.userList"
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
  <van-empty v-if="!props.userList||props.userList.length<=0" description="数据为空"/>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import myAxios from "../plugins/myAxios";
import {Dialog, Toast} from "vant";
import {TeamType} from "../models/team";
import {onMounted} from "vue";

interface UserCardListType {
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListType>(), {
  // @ts-ignore
  userList: [] as UserType[],
})

const sendFriendRequest =async (id: string) => {
  const res: any = await myAxios.post("/partner/friend/userFriend/friendUser", {
            toUserId:id})
          // @ts-ignore
          if (res.code == 200) {
            Toast.success("发送成功")
          } else {
            // @ts-ignore
            if (res.description) {
              Toast.fail(res.description);
            }
          }
  // Dialog.confirm({
  //   title: '确认添加好友吗？',
  // })
  //     .then(async () => {
  //       const res: any = await myAxios.post("/partner/friend/userFriend/friendUser", {
  //         toUserId:id})
  //       // @ts-ignore
  //       if (res.code == 200) {
  //         Toast.success("发送成功")
  //       } else {
  //         // @ts-ignore
  //         if (res.description) {
  //           Toast.fail(res.description);
  //         }
  //       }
  //     })
  //     .catch(() => {
  //       // on cancel
  //     });

}

</script>

<style scoped>

</style>
