const { createApp } = Vue;

createApp({
    data() {
        return {
            sessionStartTime: new Date(),
            sessionTime: '0 saat 0 dakika 0 saniye',
            liveExpense: 0,
            liveIncome: 0,
            totalIncome: 0,
            liveCounterKey: 0,
            intervalId: null,
            liveExpenseIntervalId: null,
            
            
            // Predefined categories
            predefinedDaily: [
                { id: 'yemek', name: 'Yemek', icon: '🍽️', amount: 0, frequency: 'daily' },
                { id: 'cay_kahve', name: 'Çay/Kahve', icon: '☕', amount: 0, frequency: 'daily' },
                { id: 'sigara', name: 'Sigara', icon: '🚬', amount: 0, frequency: 'daily' },
                { id: 'ulasim', name: 'Ulaşım', icon: '🚌', amount: 0, frequency: 'daily' },
                { id: 'diger', name: 'Diğer', icon: '💰', amount: 0, frequency: 'daily' },
            ],
            
            predefinedMonthly: [
                { id: 'kira', name: 'Kira', icon: '🏠', amount: 0, frequency: 'monthly' },
                { id: 'elektrik', name: 'Elektrik', icon: '⚡', amount: 0, frequency: 'monthly' },
                { id: 'su', name: 'Su', icon: '💧', amount: 0, frequency: 'monthly' },
                { id: 'dogalgaz', name: 'Doğalgaz', icon: '🔥', amount: 0, frequency: 'monthly' },
                { id: 'internet', name: 'İnternet', icon: '🌐', amount: 0, frequency: 'monthly' },
                { id: 'telefon', name: 'Telefon', icon: '📱', amount: 0, frequency: 'monthly' },
                { id: 'aidat', name: 'Aidat', icon: '🏢', amount: 0, frequency: 'monthly' },
                { id: 'servis', name: 'Servis Ücreti', icon: '🚐', amount: 0, frequency: 'monthly' },
                { id: 'arac_yakit', name: 'Araç Yakıtı', icon: '⛽', amount: 0, frequency: 'monthly' },
                { id: 'sgk_bagkur', name: 'SGK & Bağkur', icon: '🏥', amount: 0, frequency: 'monthly' },
                { id: 'okul_taksit', name: 'Okul Taksidi', icon: '🎓', amount: 0, frequency: 'monthly' },
                { id: 'kredi_taksit', name: 'Kredi Taksiti', icon: '🏦', amount: 0, frequency: 'monthly' },
                { id: 'kredi_karti', name: 'Kredi Kartı', icon: '💳', amount: 0, frequency: 'monthly' },
                { id: 'gym_monthly', name: 'Spor Salonu (Aylık)', icon: '💪', amount: 0, frequency: 'monthly' },
                { id: 'dijital_abonelikler', name: 'Dijital Abonelikler', icon: '📺', amount: 0, frequency: 'monthly' }
            ],
            
            predefinedYearly: [
                { id: 'arac_bakim', name: 'Araç Bakımı', icon: '🔧', amount: 0, frequency: 'yearly' },
                { id: 'arac_sigorta', name: 'Araç Sigortası', icon: '🚗', amount: 0, frequency: 'yearly' },
                { id: 'mtv', name: 'MTV', icon: '📄', amount: 0, frequency: 'yearly' },
                { id: 'arac_kasko', name: 'Araç Kaskosu', icon: '🛡️', amount: 0, frequency: 'yearly' },
                { id: 'arac_muayene', name: 'Araç Muayenesi', icon: '🔍', amount: 0, frequency: 'yearly' },
                { id: 'dask', name: 'DASK', icon: '🏠', amount: 0, frequency: 'yearly' },
                { id: 'saglik_sigorta', name: 'Sağlık Sigortası', icon: '❤️', amount: 0, frequency: 'yearly' },
                { id: 'emlak_vergi', name: 'Emlak Vergisi', icon: '🏛️', amount: 0, frequency: 'yearly' },
                { id: 'tatil', name: 'Tatil Masrafı', icon: '🏖️', amount: 0, frequency: 'yearly' },
                { id: 'gym_yearly', name: 'Spor Salonu (Yıllık)', icon: '🏋️', amount: 0, frequency: 'yearly' }
            ],
            
            // Custom categories
            customDaily: [],
            customMonthly: [],
            customYearly: [],
            
            // Counter for unique IDs
            nextCustomId: 1
        }
    },
    
    computed: {
        // Get all daily expenses (predefined + custom)
        dailyExpenses() {
            return [...this.predefinedDaily, ...this.customDaily].filter(exp => exp.amount > 0);
        },
        
        // Get all monthly expenses (predefined + custom)
        monthlyExpenses() {
            return [...this.predefinedMonthly, ...this.customMonthly].filter(exp => exp.amount > 0);
        },
        
        // Get all yearly expenses (predefined + custom)
        yearlyExpenses() {
            return [...this.predefinedYearly, ...this.customYearly].filter(exp => exp.amount > 0);
        },
        
        // Calculate daily total
        dailyTotal() {
            return this.predefinedDaily.reduce((sum, exp) => sum + (exp.amount || 0), 0) +
                   this.customDaily.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        },
        
        // Calculate monthly total
        monthlyTotal() {
            return this.predefinedMonthly.reduce((sum, exp) => sum + (exp.amount || 0), 0) +
                   this.customMonthly.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        },
        
        // Calculate yearly total
        yearlyTotal() {
            return this.predefinedYearly.reduce((sum, exp) => sum + (exp.amount || 0), 0) +
                   this.customYearly.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        },
        
        // Calculate total monthly expense (daily * 30 + monthly + yearly/12)
        totalMonthlyExpense() {
            return (this.dailyTotal * 30) + this.monthlyTotal + (this.yearlyTotal / 12);
        },
        
        // Calculate daily expense total (including converted monthly and yearly)
        dailyExpenseTotal() {
            return this.dailyTotal + (this.monthlyTotal / 30) + (this.yearlyTotal / 365);
        },
        
        // Calculate hourly expense
        hourlyExpense() {
            return this.dailyExpenseTotal / 24;
        },
        
        // Calculate weekly expense
        weeklyExpense() {
            return this.dailyExpenseTotal * 7;
        },
        
        // Calculate percentages for meters
        dailyPercentage() {
            const maxDaily = 500; // Maximum expected daily expense for meter
            return Math.min(100, (this.dailyTotal / maxDaily) * 100);
        },
        
        monthlyPercentage() {
            const maxMonthly = 10000; // Maximum expected monthly expense for meter
            return Math.min(100, (this.monthlyTotal / maxMonthly) * 100);
        }
    },
    
    mounted() {
        this.loadData();
        this.startSessionTimer();
        this.startLiveExpenseCounter();
    },
    
    beforeUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.liveExpenseIntervalId) {
            clearInterval(this.liveExpenseIntervalId);
        }
    },
    
    methods: {
        // Format plain numeric amount into input-friendly string with thousand separators (e.g., 123.456.789)
        formatInput(amount) {
            const numericAmount = Number(amount || 0);
            const sign = numericAmount < 0 ? '-' : '';
            const abs = Math.floor(Math.abs(numericAmount));
            const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return sign + formatted;
        },

        // Parse any input string into a non-decimal integer amount by stripping non-digits
        parseAmountFromInput(inputValue) {
            const digits = (inputValue || '').toString().replace(/\D/g, '');
            return Number(digits || 0);
        },

        // Unified input handler for all amount inputs (daily/monthly/yearly + custom)
        onAmountInput(category, rawValue) {
            const parsed = this.parseAmountFromInput(rawValue);
            // Update local object
            category.amount = parsed;

            // Persist to correct bucket using existing helpers
            const isDaily = !!this.predefinedDaily.find(c => c.id === category.id) || !!this.customDaily.find(c => c.id === category.id);
            const isMonthly = !!this.predefinedMonthly.find(c => c.id === category.id) || !!this.customMonthly.find(c => c.id === category.id);
            const isYearly = (!!this.predefinedYearly && !!this.predefinedYearly.find(c => c.id === category.id)) || (!!this.customYearly && !!this.customYearly.find(c => c.id === category.id));

            if (isDaily || isMonthly || isYearly) {
                // Try predefined first
                if (this.predefinedDaily.find(c => c.id === category.id) || this.predefinedMonthly.find(c => c.id === category.id) || (this.predefinedYearly && this.predefinedYearly.find(c => c.id === category.id))) {
                    this.updateExpense(category.id, parsed);
                } else {
                    // Custom categories
                    this.updateCustomCategory(category.id, category.name, parsed);
                }
            }

            this.calculateLiveExpense();
            this.saveData();
        },

        // Income input handler
        onIncomeInput(rawValue) {
            const parsed = this.parseAmountFromInput(rawValue);
            this.totalIncome = parsed;
            this.calculateLiveExpense();
            this.saveData();
        },

        // Format currency to Turkish Lira with kuruş
        formatCurrency(amount) {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount || 0);
        },
        
        // Start the session timer that updates every second
        startSessionTimer() {
            this.updateSessionTime();
            this.intervalId = setInterval(() => {
                this.updateSessionTime();
            }, 1000);
        },
        
        // Start live expense counter that updates 10 times per second
        startLiveExpenseCounter() {
            this.calculateLiveExpense();
            this.liveExpenseIntervalId = setInterval(() => {
                this.calculateLiveExpense();
                this.liveCounterKey++; // Force re-render for animation
            }, 100); // 100ms = 10 times per second
        },
        
        // Update session time display
        updateSessionTime() {
            const now = new Date();
            const timeDiff = now - this.sessionStartTime;
            
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            // Smart time formatting - only show non-zero values
            let timeString = "";
            let parts = [];
            
            if (hours > 0) {
                parts.push(`${hours} saat`);
            }
            if (minutes > 0) {
                parts.push(`${minutes} dakika`);
            }
            if (seconds > 0 || parts.length === 0) { // Always show seconds if nothing else
                parts.push(`${seconds} saniye`);
            }
            
            // Join parts with commas
            if (parts.length === 1) {
                timeString += parts[0];
            } else if (parts.length === 2) {
                timeString += parts.join(", ");
            } else {
                timeString += parts.slice(0, -1).join(", ") + ", " + parts[parts.length - 1];
            }
            
            this.sessionTime = timeString;
        },
        
        // Calculate live expense based on session time
        calculateLiveExpense() {
            const now = new Date();
            const sessionSeconds = (now - this.sessionStartTime) / 1000;
            
            // Calculate expense per second (more precise calculation)
            const dailyExpensePerSecond = this.dailyTotal / (24 * 60 * 60); // Daily expense per second
            const monthlyExpensePerSecond = this.monthlyTotal / (30 * 24 * 60 * 60); // Monthly expense per second
            
            // Calculate live expense with kuruş precision
            this.liveExpense = (dailyExpensePerSecond + monthlyExpensePerSecond) * sessionSeconds;
            
            // Round to 2 decimal places for kuruş precision
            this.liveExpense = Math.round(this.liveExpense * 100) / 100;
            
            // Calculate live income if total income is set
            if (this.totalIncome > 0) {
                const monthlyIncomePerSecond = this.totalIncome / (30 * 24 * 60 * 60); // Monthly income per second
                this.liveIncome = monthlyIncomePerSecond * sessionSeconds;
                this.liveIncome = Math.round(this.liveIncome * 100) / 100;
            } else {
                this.liveIncome = 0;
            }
        },
        
        // Update expense amount
        updateExpense(categoryId, amount) {
            const predefinedDaily = this.predefinedDaily.find(cat => cat.id === categoryId);
            if (predefinedDaily) {
                predefinedDaily.amount = Number(amount) || 0;
            } else {
                const predefinedMonthly = this.predefinedMonthly.find(cat => cat.id === categoryId);
                if (predefinedMonthly) {
                    predefinedMonthly.amount = Number(amount) || 0;
                } else {
                    const predefinedYearly = this.predefinedYearly.find(cat => cat.id === categoryId);
                    if (predefinedYearly) {
                        predefinedYearly.amount = Number(amount) || 0;
                    }
                }
            }
            this.calculateLiveExpense(); // Recalculate when expense changes
            this.saveData();
        },
        
        // Remove expense (reset to 0)
        removeExpense(categoryId) {
            const predefinedDaily = this.predefinedDaily.find(cat => cat.id === categoryId);
            if (predefinedDaily) {
                predefinedDaily.amount = 0;
            } else {
                const predefinedMonthly = this.predefinedMonthly.find(cat => cat.id === categoryId);
                if (predefinedMonthly) {
                    predefinedMonthly.amount = 0;
                } else {
                    const predefinedYearly = this.predefinedYearly.find(cat => cat.id === categoryId);
                    if (predefinedYearly) {
                        predefinedYearly.amount = 0;
                    }
                }
            }
            this.saveData();
        },
        
        // Add custom daily category
        addCustomDaily() {
            const newCategory = {
                id: `custom_daily_${this.nextCustomId++}`,
                name: '',
                amount: 0,
                frequency: 'daily'
            };
            this.customDaily.push(newCategory);
            this.saveData();
        },
        
        // Add custom monthly category
        addCustomMonthly() {
            const newCategory = {
                id: `custom_monthly_${this.nextCustomId++}`,
                name: '',
                amount: 0,
                frequency: 'monthly'
            };
            this.customMonthly.push(newCategory);
            this.saveData();
        },
        
        // Add custom yearly category
        addCustomYearly() {
            const newCategory = {
                id: `custom_yearly_${this.nextCustomId++}`,
                name: '',
                amount: 0,
                frequency: 'yearly'
            };
            this.customYearly.push(newCategory);
            this.saveData();
        },
        
        // Update custom category
        updateCustomCategory(categoryId, name, amount) {
            const dailyCategory = this.customDaily.find(cat => cat.id === categoryId);
            if (dailyCategory) {
                dailyCategory.name = name;
                dailyCategory.amount = Number(amount) || 0;
            } else {
                const monthlyCategory = this.customMonthly.find(cat => cat.id === categoryId);
                if (monthlyCategory) {
                    monthlyCategory.name = name;
                    monthlyCategory.amount = Number(amount) || 0;
                } else {
                    const yearlyCategory = this.customYearly.find(cat => cat.id === categoryId);
                    if (yearlyCategory) {
                        yearlyCategory.name = name;
                        yearlyCategory.amount = Number(amount) || 0;
                    }
                }
            }
            this.calculateLiveExpense(); // Recalculate when expense changes
            this.saveData();
        },
        
        // Remove custom category
        removeCustomCategory(categoryId) {
            this.customDaily = this.customDaily.filter(cat => cat.id !== categoryId);
            this.customMonthly = this.customMonthly.filter(cat => cat.id !== categoryId);
            this.customYearly = this.customYearly.filter(cat => cat.id !== categoryId);
            this.saveData();
        },
        
        // Clear all data
        clearAllData() {
            if (confirm('Tüm verilerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                // Reset predefined categories
                this.predefinedDaily.forEach(cat => cat.amount = 0);
                this.predefinedMonthly.forEach(cat => cat.amount = 0);
                this.predefinedYearly.forEach(cat => cat.amount = 0);
                
                // Clear custom categories
                this.customDaily = [];
                this.customMonthly = [];
                this.customYearly = [];
                
                // Reset counter
                this.nextCustomId = 1;
                
                // Reset income
                this.totalIncome = 0;
                
                this.saveData();
            }
        },
        
        // Save data to localStorage
        saveData() {
            const data = {
                predefinedDaily: this.predefinedDaily,
                predefinedMonthly: this.predefinedMonthly,
                predefinedYearly: this.predefinedYearly,
                customDaily: this.customDaily,
                customMonthly: this.customMonthly,
                customYearly: this.customYearly,
                nextCustomId: this.nextCustomId,
                totalIncome: this.totalIncome
            };
            localStorage.setItem('gidermetre_data', JSON.stringify(data));
        },
        
        // Load data from localStorage
        loadData() {
            const savedData = localStorage.getItem('gidermetre_data');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    
                    // Load predefined categories (preserve structure, only load amounts)
                    if (data.predefinedDaily) {
                        data.predefinedDaily.forEach(savedCat => {
                            const existingCat = this.predefinedDaily.find(cat => cat.id === savedCat.id);
                            if (existingCat) {
                                existingCat.amount = savedCat.amount || 0;
                            }
                        });
                    }
                    
                    if (data.predefinedMonthly) {
                        data.predefinedMonthly.forEach(savedCat => {
                            const existingCat = this.predefinedMonthly.find(cat => cat.id === savedCat.id);
                            if (existingCat) {
                                existingCat.amount = savedCat.amount || 0;
                            }
                        });
                    }
                    
                    if (data.predefinedYearly) {
                        data.predefinedYearly.forEach(savedCat => {
                            const existingCat = this.predefinedYearly.find(cat => cat.id === savedCat.id);
                            if (existingCat) {
                                existingCat.amount = savedCat.amount || 0;
                            }
                        });
                    }
                    
                    // Load custom categories
                    if (data.customDaily) {
                        this.customDaily = data.customDaily;
                    }
                    
                    if (data.customMonthly) {
                        this.customMonthly = data.customMonthly;
                    }
                    
                    if (data.customYearly) {
                        this.customYearly = data.customYearly;
                    }
                    
                    // Load counter
                    if (data.nextCustomId) {
                        this.nextCustomId = data.nextCustomId;
                    }
                    
                    // Load total income
                    if (data.totalIncome) {
                        this.totalIncome = data.totalIncome;
                    }
                } catch (error) {
                    console.error('Error loading saved data:', error);
                }
            }
        }
    }
}).mount('#app');
