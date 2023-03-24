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
      <van-button size="mini" @click="isShow(user.id)">添加好友</van-button>
    </template>
  </van-card>
  <van-empty v-if="!props.userList||props.userList.length<=0" description="数据为空"/>
  <van-dialog v-model:show="show" title="确认添加好友吗?" @confirm="sendFriendRequest" @closed="close" show-cancel-button>
    <van-cell-group inset>
      <van-field
          v-model="message"
          rows="1"
          autosize
          label="备注"
          type="textarea"
          placeholder="请输入备注"
      />
    </van-cell-group>
  </van-dialog>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import myAxios from "../plugins/myAxios";
import {showSuccessToast, showFailToast} from 'vant';
import {ref} from "vue";

const show = ref(false);
const message = ref('');
const userId = ref('');

interface UserCardListType {
  userList: UserType[];
}
const emits = defineEmits(['userId'])

const props = withDefaults(defineProps<UserCardListType>(), {
  // @ts-ignore
  userList: [] as UserType[],
})

const sendFriendRequest = () => {
  if (userId.value === '') {
    return;
  }
  myAxios.post("/partner/friend/userFriend/friend", {
    toUserId: userId.value,
    message: message.value,
  }).then(resp => {
    // @ts-ignore
    if (resp.code == 200) {
      if (resp.data&&resp.data === 1) {
        showSuccessToast("发送成功");
        return
      }
        showSuccessToast("同意好友申请");
    } else {
      // @ts-ignore
      if (resp.description) {
        // @ts-ignore
        showFailToast(resp.description);
      }
    }
  }).catch(resp=>{

      showFailToast("发送失败")

  });
}
const close = () => {
  message.value = '';
  userId.value = '';
}
const isShow = (id: string) => {
  emits("userId",id)
}
</script>

<style scoped>

</style>
