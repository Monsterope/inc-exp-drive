<template>
    <div class="flex items-center justify-center bg-gray-50">
        <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow-md space-y-4">
            <div>
                <UButton @click="clickMenu('deposit')">Deposit</UButton>
                <UButton @click="clickMenu('withdraw')" color="error">Withdraw</UButton>
                <UButton @click="clickMenu('history')" color="info">History</UButton>
            </div>
            <div>
                <UButton @click="addData" block :color="menuColor" :disabled="submitDisabled">{{ isLoading == true ? "Saving..." : catePrice }}</UButton>
            </div>
            <div v-if="catePrice == 'deposit' || catePrice == 'withdraw'">
                <USelect v-model="typePrice" :items="typeItems" class="w-48" />
                <span> ชนิด</span>
            </div>
            <div v-if="catePrice == 'withdraw'">
                <UInput placeholder="NamePrice" v-model="name" />
                <span> ชื่อ</span>
            </div>
            <div v-if="catePrice == 'deposit' || catePrice == 'withdraw'">
                <UInput placeholder="AmountAll" v-model="amount_all" type="number" />
                <span> {{ catePrice == "withdraw" ? " จ่ายไป" : " รับมา" }}</span>
            </div>
            <div v-if="catePrice == 'deposit'">
                <UInput placeholder="AmountCust" v-model="amount_cust" type="number" @blur="calAmountTip" />
                <span> ลูกค้า</span>
            </div>
            <div v-if="catePrice == 'deposit'">
                <UInput placeholder="AmountTip" v-model="amount_tip" type="number" />
                <span> ทิป</span>
            </div>
            <div v-if="catePrice == 'deposit'">
                <UInput placeholder="AmountValid" v-model="amount_valid" type="number" />
                <span> ได้จริง</span>
            </div>
            <div v-if="catePrice == 'history'">
                <UInput class="w-full" placeholder="Datetime" v-model="dateT" type="date" />
            </div>
            <div v-if="catePrice == 'history'" class="flex justify-center items-center gap-4 text-center">
                <span>
                    <div>สุทธิ</div>
                    <div><UBadge :color="dataHisSum.balance < 0 ? 'error' : 'success'">{{ dataHisSum.balance }}</UBadge></div>
                </span>
            </div>
            <div v-if="catePrice == 'history'" class="flex justify-center items-center gap-4 text-center">
                <span>
                    <div>จ่ายไป</div>
                    <div><UBadge color="error">{{ dataHisSum.withdraw }}</UBadge></div>
                </span>
                <span>
                    <div>app</div>
                    <div><UBadge color="error">{{ dataHisSum.app }}</UBadge></div>
                </span>
            </div>
            <div v-if="catePrice == 'history'" class="flex justify-center items-center gap-4 text-center">
                <span>
                    <div>รับมา</div>
                    <div><UBadge color="warning">{{ dataHisSum.all }}</UBadge></div>
                </span>
                <span>
                    <div>ลูกค้า</div>
                    <div><UBadge color="warning">{{ dataHisSum.cust }}</UBadge></div>
                </span>
                <span>
                    <div>ทิป</div>
                    <div><UBadge color="success">{{ dataHisSum.tip }}</UBadge></div>
                </span>
                <span>
                    <div>ได้จริง</div>
                    <div><UBadge color="success">{{ dataHisSum.valid }}</UBadge></div>
                </span>
            </div>
            <div v-if="catePrice == 'history'" >
                <div class="overflow-y-auto max-h-[20vh] space-y-4">
                    <div v-for="(his,i) in dataHis" class="w-full max-w-sm p-6 rounded-xl shadow-md space-y-4" :class="his.cate == 'withdraw' ? 'bg-red-400' : 'bg-green-300'">
                        <div class="text-xs">{{ dateFormatFunc(his.datetime) }} <UBadge color="info">{{ his.type }} </UBadge> <UBadge color="neutral">{{ his.name }}</UBadge></div>
                        <div class="flex justify-center items-center gap-4 text-center">
                            <span>
                                <div>{{ his.amount_all }}</div>
                            </span>
                            <span>
                                <div>{{ his.amount_cust }}</div>
                            </span>
                            <span>
                                <div>{{ his.amount_tip }}</div>
                            </span>
                            <span>
                                <div>{{ his.amount_valid }}</div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { UBadge } from '#components'

definePageMeta({
    middleware: ['auth']
})

const { api } = useCallApi()

const name = ref("deposit")
const typeItems = ref(["cash", "scan", "qr", "app"])
const typePrice = ref("cash")
const catePrice = ref("deposit")
const amount_all = ref(0)
const amount_cust = ref(0)
const amount_tip = ref(0)
const amount_valid = ref(0)

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
const dateT = ref(`${yyyy}-${mm}-${dd}`)

const dataHis = ref([])
const dataHisSum = ref({})
const isLoading = ref(false)

const clickMenu = async (menuType) => {
    name.value = menuType == "deposit" ? menuType : ""
    typePrice.value = "cash"
    catePrice.value = menuType
    amount_all.value = 0
    amount_cust.value = 0
    amount_tip.value = 0
    amount_valid.value = 0
    if (menuType == 'history'){
        await getHistory()
    }
}

const addData = async() => {
    isLoading.value = true
    const reqData = {
        "name": name.value,
        "type": typePrice.value,
        "cate": catePrice.value,
        "amount_all": amount_all.value,
        "amount_cust": amount_cust.value,
        "amount_tip": amount_tip.value,
        "amount_valid": amount_valid.value
    }

    try {
        await api("/api/add-driver", {
            method: "POST",
            body: reqData
        })
        await clickMenu(catePrice.value)
        isLoading.value = false
    } catch (error) {
        console.log(error)
        isLoading.value = false
    }

}

const calAmountTip = async() => {
    if (typePrice.value != "app" && typePrice.value != "qr"){
        amount_tip.value = amount_all.value - amount_cust.value
    }
}

const menuColor = computed(() => {
    if (catePrice.value == "deposit"){
        return "success"
    }
    if (catePrice.value == "withdraw"){
        return "error"
    }
    if (catePrice.value == "history"){
        return "info"
    }
})

const submitDisabled = computed(() => {
    if (catePrice.value == "deposit"){
        if (isLoading.value == true){
            return true
        }
        if (amount_all.value == 0 && amount_cust.value == 0 &&amount_tip.value == 0 && amount_valid.value == 0){
            return true
        }
        return false
    }
    if (catePrice.value == "withdraw"){
        if (isLoading.value == true){
            return true
        }
        if (name.value == ""){
            return true
        }
        if (amount_all.value == 0){
            return true
        }
        return false
    }
    if (catePrice.value == "history"){
        return true
    }
})

const getHistory = async () => {
    try {
        const hisDatas = await api("/api/his-driver", {
            method: "POST",
            body: {
                select_date: dateT.value
            }
        })

        dataHis.value = hisDatas.data
        dataHisSum.value = hisDatas.sum_amount
    } catch (error) {
        console.log(error)
    }
}

const dateFormatFunc = (data) => {
    const f_today = new Date(data);
    // const f_yyyy = f_today.getFullYear();
    // let f_mm = f_today.getMonth() + 1; // Months start at 0!
    // let f_dd = f_today.getDate();
    // if (f_dd < 10) f_dd = '0' + f_dd;
    // if (f_mm < 10) f_mm = '0' + f_mm;
    return `${f_today.getHours()}:${f_today.getMinutes()}`
}

watch(dateT, async (newData, oldData) => {
    // console.log(dateT.value)
    await getHistory()
})

</script>