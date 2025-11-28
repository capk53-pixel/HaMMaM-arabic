import React from 'react';
import { useState } from 'react';
import { UserData } from '../types';

interface OnboardingFormProps {
  onSubmit: (data: UserData) => void;
  onStartCustomization: () => void;
}

const formGroupClasses = "mb-6";
const labelClasses = "block mb-2 text-sm font-medium text-slate-700";
const inputClasses = "bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-slate-400";
const buttonClasses = "w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-transform transform hover:scale-105 shadow-lg";

// Define a type for the form's state that allows empty strings for number inputs
type OnboardingFormData = Omit<UserData, 'age' | 'weight' | 'height'> & {
    age: string;
    weight: string;
    height: string;
};

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, onStartCustomization }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    experience: 'intermediate',
    goal: 'muscle_gain',
    daysPerWeek: 4,
    secondaryGoals: [],
    bodyType: 'mesomorph',
    problemAreas: [],
    injuries: [],
    injuryDetails: '',
    activityLevel: 'sedentary',
    equipment: 'full_gym',
  });
  const [error, setError] = useState('');

  const handleNext = () => {
      if (step === 1) {
          const age = Number(formData.age);
          const weight = Number(formData.weight);
          const height = Number(formData.height);
          if (!age || age < 15 || age > 90 || !weight || weight < 30 || !height || height < 100) {
              setError("الرجاء إدخال قيم واقعية.");
              return;
          }
      }
      setError('');
      setStep(prev => prev + 1);
  };
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    onSubmit({
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height)
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (group: 'secondaryGoals' | 'problemAreas' | 'injuries', value: string) => {
    setFormData(prev => {
        const currentValues = prev[group] || [];
        const newValues = currentValues.includes(value as never) 
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        return { ...prev, [group]: newValues };
    });
  };

  const renderStep = () => {
      switch(step) {
          case 1: return <Step1 formData={formData} handleChange={handleChange} />;
          case 2: return <Step2 formData={formData} setFormData={setFormData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
          case 3: return <Step3 formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />;
          case 4: return <Step4 formData={formData} handleChange={handleChange} />;
          default: return <Step1 formData={formData} handleChange={handleChange} />;
      }
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-slate-200" dir="rtl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">أخبرنا عنك</h2>
        <p className="mt-2 text-slate-500">لنصمم لك الخطة المثالية</p>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700">الخطوة {step} من 4</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${(step / 4) * 100}%`}}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-center -mb-2">{error}</p>}
        {renderStep()}
        <div className="flex gap-4 pt-4">
            {step > 1 && <button type="button" onClick={handleBack} className="w-1/3 text-slate-800 bg-slate-200 hover:bg-slate-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors">رجوع</button>}
            {step < 4 && <button type="button" onClick={handleNext} className="flex-1 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors">التالي</button>}
            {step === 4 && <button type="submit" className={buttonClasses}>أنشئ خطتي التدريبية</button>}
        </div>
      </form>

       <div className="text-center mt-4 pt-4 border-t border-slate-200/80">
            <p className="text-slate-500">
                أو تفضل التحكم الكامل؟{' '}
                <button
                type="button"
                onClick={onStartCustomization}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                أنشئ خطتك المخصصة بنفسك
                </button>
            </p>
        </div>
    </div>
  );
};


const Step1 = ({ formData, handleChange }: { formData: OnboardingFormData, handleChange: any }) => {
    return (
        <div className="animate-fade-in">
            <h3 className="text-xl font-semibold text-center mb-4 text-slate-800">المعلومات الأساسية</h3>
            <div className="grid md:grid-cols-2 md:gap-6">
                <div className={formGroupClasses}>
                    <label htmlFor="gender" className={labelClasses}>الجنس</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                    </select>
                </div>
                <div className={formGroupClasses}>
                    <label htmlFor="age" className={labelClasses}>العمر</label>
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className={inputClasses} required placeholder="مثال: 25" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6">
                <div className={formGroupClasses}>
                    <label htmlFor="weight" className={labelClasses}>الوزن (كجم)</label>
                    <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} required placeholder="مثال: 70" />
                </div>
                <div className={formGroupClasses}>
                    <label htmlFor="height" className={labelClasses}>الطول (سم)</label>
                    <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} className={inputClasses} required placeholder="مثال: 175" />
                </div>
            </div>
        </div>
    );
}

const Step2 = ({ formData, setFormData, handleChange, handleCheckboxChange }: { formData: OnboardingFormData, setFormData: any, handleChange: any, handleCheckboxChange: any }) => {
    const secondaryGoalOptions: { [key in 'endurance' | 'flexibility' | 'posture']: string } = {
        endurance: "تحسين التحمل",
        flexibility: "زيادة المرونة",
        posture: "تحسين القوام",
    };
    return (
     <div className="animate-fade-in">
        <h3 className="text-xl font-semibold text-center mb-4 text-slate-800">الخبرة والأهداف</h3>
        <div className={formGroupClasses}>
          <label htmlFor="experience" className={labelClasses}>مستوى الخبرة</label>
          <select id="experience" name="experience" value={formData.experience} onChange={handleChange} className={inputClasses}>
            <option value="beginner">مبتدئ (أقل من 6 أشهر)</option>
            <option value="intermediate">متوسط (6 أشهر - سنتان)</option>
            <option value="advanced">متقدم (أكثر من سنتين)</option>
          </select>
        </div>
        <div className={formGroupClasses}>
          <label htmlFor="goal" className={labelClasses}>الهدف الأساسي</label>
          <select id="goal" name="goal" value={formData.goal} onChange={handleChange} className={inputClasses}>
            <option value="muscle_gain">زيادة الكتلة العضلية</option>
            <option value="fat_loss">خسارة الدهون</option>
            <option value="body_recomposition">خسارة دهون واكتساب عضلات</option>
            <option value="strength_gain">زيادة القوة</option>
            <option value="general_fitness">لياقة عامة</option>
          </select>
        </div>
        <div className={formGroupClasses}>
            <label className={labelClasses}>أيام التدريب في الأسبوع</label>
            <div className="flex justify-around items-center bg-white border border-slate-200 rounded-lg p-1">
                {[3, 4, 5].map(day => (
                    <button
                        key={day}
                        type="button"
                        onClick={() => setFormData((prev: OnboardingFormData) => ({ ...prev, daysPerWeek: day as 3|4|5 }))}
                        className={`w-full py-2 rounded-md font-semibold transition-colors ${formData.daysPerWeek === day ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                        {day} أيام
                    </button>
                ))}
            </div>
        </div>
        <div className={formGroupClasses}>
          <label className={labelClasses}>أهداف ثانوية (اختياري)</label>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
            {Object.entries(secondaryGoalOptions).map(([value, label]) => (
              <label key={value} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-md transition-colors hover:bg-slate-100/50 cursor-pointer">
                <input
                  type="checkbox"
                  value={value}
                  checked={formData.secondaryGoals?.includes(value as any)}
                  onChange={() => handleCheckboxChange('secondaryGoals', value)}
                  className="w-5 h-5 text-blue-600 bg-slate-200 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
    </div>
    );
}

const Step3 = ({ formData, handleChange, handleCheckboxChange }: { formData: OnboardingFormData, handleChange: any, handleCheckboxChange: any }) => {
    const bodyTypeOptions = {
        ectomorph: { title: "إكتومورف", description: "نحيف وطويل، يجد صعوبة في بناء العضلات." },
        mesomorph: { title: "ميزومورف", description: "بنية عضلية جيدة، ومعدل حرق مرتفع." },
        endomorph: { title: "إندومورف", description: "بنية ضخمة، نسبة دهون عالية، غالبًا على شكل كمثرى." },
    };
    const problemAreaOptions = {
        belly: "البطن والخصر",
        thighs: "الأفخاذ والأرداف",
        arms: "الذراعين",
        chest: "الصدر (تثدي)",
    };
    const injuryOptions = {
        lower_back: "أسفل الظهر",
        knees: "الركبتين",
        shoulders: "الكتفين",
        wrists: "المعصمين",
    };
    return (
    <div className="animate-fade-in">
        <h3 className="text-xl font-semibold text-center mb-4 text-slate-800">ملفك الجسدي</h3>
        <div className={formGroupClasses}>
            <label className={labelClasses}>أي وصف يطابق شكل جسمك أكثر؟</label>
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                {Object.entries(bodyTypeOptions).map(([key, { title, description }]) => (
                    <label key={key} className="flex items-start space-x-3 rtl:space-x-reverse p-2 rounded-md transition-colors hover:bg-slate-100/50 cursor-pointer">
                        <input
                            type="radio"
                            name="bodyType"
                            value={key}
                            checked={formData.bodyType === key}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 bg-slate-200 border-slate-300 focus:ring-blue-500 focus:ring-2 mt-1 flex-shrink-0"
                        />
                        <div>
                            <span className="text-slate-800 font-semibold">{title}</span>
                            <p className="text-sm text-slate-500">{description}</p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
        <div className={formGroupClasses}>
          <label className={labelClasses}>حدد أماكن تراكم الدهون (اختياري)</label>
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                {Object.entries(problemAreaOptions).map(([value, label]) => (
                  <label key={value} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-md transition-colors hover:bg-slate-100/50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={value}
                      checked={formData.problemAreas?.includes(value as any)}
                      onChange={() => handleCheckboxChange('problemAreas', value)}
                      className="w-5 h-5 text-blue-600 bg-slate-200 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-slate-700">{label}</span>
                  </label>
                ))}
            </div>
        </div>
        <div className={formGroupClasses}>
          <label className={labelClasses}>هل تعاني من إصابات أو قيود جسدية؟</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(injuryOptions).map(([value, label]) => (
              <label key={value} className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.injuries?.includes(value) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <input type="checkbox" value={value} checked={formData.injuries?.includes(value)} onChange={() => handleCheckboxChange('injuries', value)} className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                <span className="ms-2 text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
        {formData.injuries && formData.injuries.length > 0 && (
             <div className={`${formGroupClasses} animate-fade-in`}>
                <label htmlFor="injuryDetails" className={labelClasses}>يرجى تقديم المزيد من التفاصيل (اختياري)</label>
                <textarea id="injuryDetails" name="injuryDetails" value={formData.injuryDetails} onChange={handleChange} className={inputClasses} rows={3} placeholder="مثال: ألم خفيف في الركبة اليمنى عند عمل السكوات العميق..."></textarea>
             </div>
        )}
    </div>
    );
}

const Step4 = ({ formData, handleChange }: { formData: OnboardingFormData, handleChange: any }) => {
    return (
    <div className="animate-fade-in">
        <h3 className="text-xl font-semibold text-center mb-4 text-slate-800">نمط الحياة والمعدات</h3>
        <div className={formGroupClasses}>
            <label htmlFor="activityLevel" className={labelClasses}>مستوى نشاطك اليومي (خارج الجيم)</label>
            <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={inputClasses}>
                <option value="sedentary">خامل (عمل مكتبي، جلوس معظم اليوم)</option>
                <option value="lightly_active">نشاط خفيف (مشي، عمل يتطلب بعض الحركة)</option>
                <option value="active">نشط (عمل يدوي، حركة مستمرة)</option>
            </select>
        </div>
        <div className={formGroupClasses}>
            <label htmlFor="equipment" className={labelClasses}>المعدات المتاحة لك</label>
            <select id="equipment" name="equipment" value={formData.equipment} onChange={handleChange} className={inputClasses}>
                <option value="full_gym">جيم متكامل (جميع الأجهزة والأوزان الحرة)</option>
                <option value="home_gym">جيم منزلي (دمبلز، أحزمة مقاومة)</option>
                <option value="bodyweight">وزن الجسم فقط (لا توجد معدات)</option>
            </select>
        </div>
    </div>
    );
}


export default OnboardingForm;