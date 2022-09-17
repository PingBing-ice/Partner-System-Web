<template>
  <div id="addTeam">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamFrom.name"
            name="队伍名"
            label="队伍名"
            placeholder="队伍名"
            :rules="[{ required: true, message: '请填写队伍名' }]"
        />
        <van-field name="radio" label="状态">
          <template #input>
            <van-radio-group v-model="addTeamFrom.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-if="Number(addTeamFrom.status) === 2"
                   v-model="addTeamFrom.password"
                   type="password"
                   name="password"
                   label="队伍密码"
                   placeholder="密码"
                   :rules="[{ required: true, message: '请填写队伍密码' }]"
        />
        <van-field name="stepper" label="步进器">
          <template #input>
            <van-stepper v-model="addTeamFrom.maxNum" min="2" max="20"/>
          </template>
        </van-field>


        <van-field
            is-link
            readonly
            name="datetimePicker"
            label="选择过期时间"
            :placeholder="addTeamFrom.expireTime??'点击选择时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-datetime-picker
              v-model="addTeamFrom.expireTime"
              type="date"
              title="选择过期时间"
              @confirm="showPicker=false"
              @cancel="showPicker=false"
              :min-date="minDate"
          />
        </van-popup>
        <van-field
            v-model="addTeamFrom.description"
            rows="3"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>

  </div>
</template>

<script setup>
import {ref} from "vue";
import myAxios from "../../plugins/myAxios";
import {Toast} from "vant";
import {useRouter} from "vue-router";

const showPicker = ref(false);
const minDate = new Date();
const router=useRouter();
const initFromData = {
  "name": "",
  "description": "",
  "expireTime": "",
  "maxNum": 0,
  "password": "",
  "status": 0
}
const addTeamFrom = ref({...initFromData})
const onSubmit =async () => {
  const postData =  {
    ...addTeamFrom.value,
    status: Number(addTeamFrom.value.status)
  }
  const res = await myAxios.post('/partner/team/addTeam',postData);
  if (res?.code === 200) {
    Toast.success("添加成功")
    await router.push({
      path: "/team",
    })
  }else {
    Toast.fail("添加失败")
  }
}
</script>

<style scoped>

</style>
