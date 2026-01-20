export const merchant ={
    dashboard:{
        'stats':'/method/iswitch.merchant_portal_api.get_dashboard_stats',
        'getbalance':'/method/iswitch.merchant_portal_api.get_wallet_balance'
    }
}


export const API_URLS = {
  merchant: {
    dashboard: {
      stats: '/method/iswitch.merchant_portal_api.get_dashboard_stats',
      balance: '/method/iswitch.merchant_portal_api.get_wallet_balance'
    },
    profile:{
        getProfile:'/method/iswitch.merchant_portal_api.get_merchant_profile',
        updateProfile:'/method/iswitch.merchant_portal_api.get_merchant_profile'
    },
    apikey:{
        getApikey:'/method/iswitch.merchant_portal_api.get_api_keys',
        updateApikey:'/method/iswitch.merchant_portal_api.generate_api_keys'
    },
    ip:{
        getIP:'/method/iswitch.merchant_portal_api.get_whitelist_ips',
        addIP:'/method/iswitch.merchant_portal_api.add_whitelist_ip',
        deleteIP:'/method/iswitch.merchant_portal_api.delete_whitelist_ip'
    },
    webhook:{
        updateWebhook:'/method/iswitch.merchant_portal_api.update_webhook_url'
    },
    transaction:{
        transaction:'/method/iswitch.merchant_portal_api.get_orders'
    },
    virtualAccount:{
        virtualAccount:'/method/iswitch.merchant_portal_api.get_virtual_accounts'
    },
    ledger:{
        ledger:'/method/iswitch.merchant_portal_api.get_ledger_entries'
    },
    vanlog:{
        vanlog:'/method/iswitch.merchant_portal_api.get_van_logs'
    },
    

   
  },

  admin: {
    dashboard: {
      stats: '/method/iswitch.admin_portal_api.get_dashboard_stats'
    }, 
    profile:{
        getProfile:'/method/iswitch.admin_portal_api.get_admin_profile',
        updateProfile:'/method/iswitch.merchant_portal_api.get_merchant_profile'
    },
     transaction:{
        transaction:'/method/iswitch.admin_portal_api.get_orders'
    },
    virtualAccount:{
        virtualAccount:'/method/iswitch.admin_portal_api.get_virtual_accounts'
    },
    vanlog:{
        vanlog:'/method/iswitch.admin_portal_api.get_van_logs'
    },
    merchant:{
        merchant:'/method/iswitch.admin_portal_api.get_merchants',
        onboard:'/method/iswitch.admin_portal_api.onboard_merchant',
        update:'/method/iswitch.admin_portal_api.update_merchant',
        bulkUpdate:'/method/iswitch.admin_portal_api.bulk_update_merchants'
    },
    apiManager:{
        getApilist:'/method/iswitch.admin_portal_api.get_processors'
    }
    
  }
};
