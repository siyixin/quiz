var app = angular.module('quizApp',[]);

app.directive('quiz',function($http,quizFactory){
    return {
        restrict:'AE',
        scope:{},
        templateUrl:'template.html',
        link:function(scope,elem,attrs){
            scope.start = function(){
                scope.id = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.loadQuiz(scope.quizName);
                scope.total = quizFactory.total();
                
                scope.getQuestion();
            };
            scope.loadQuiz = function(url){
                quizFactory.load(url).then(function(response){
                    scope.questions = response;
                    quizFactory.loadQuestion(response.data);
                    scope.total = quizFactory.total();
                    scope.getQuestion();
                });
            };
            scope.reset = function(){
                scope.names = [{id:"1.json",name:"党内法规及重要政策文件"}, {id:"2.json",name:"基础法律、行政法规"}, {id:"4.json",name:"检验检疫法律、行政法规"}];
                scope.inProgress = false;
                scope.score = 0;
            };
            scope.getQuestion = function(){
                var q = quizFactory.getQuestion(scope.id);
                if(q){
                    scope.question = q.question;
                    scope.options = q.options;
                    scope.answer = q.answer;
                    scope.isSingle = (q.answer.length > 1?false:true)||(q.answer == "正确"?true:false) || (q.answer == "错误"?true:false);
                    scope.answerMode = true;
                }
                else{scope.quizOver = true;}
            };
            scope.checkAnswer = function(){
                var ans ="";
                var inputlength = 0;

                if(!$('input[name=answer]:checked').length)return;
                else inputlength = $('input[name=answer]:checked').length;

                for(var i=0;i<inputlength;i++)
                    ans = ans + ($('input[name=answer]:checked')[i]).value.split("．")[0];

                if(ans == scope.answer){
                    scope.score++;
                    scope.correctAns = true;
                }else{
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            };

            scope.nextQuestion = function(){
                scope.id++;
                scope.getQuestion();
            };

            scope.reset();
        }
    }
});

app.factory('quizFactory',function($http,$q){
    var questions = [];
    // var questions = [
    //     {"question":"《中共中央关于全面推进依法治国若干重大问题的决定》提出，全面推进依法治国，总目标是_________________。","options":["A．建设中国特色社会主义法治体系，建设社会主义法治国家","B．建设中国特色社会主义法治体系，建设社会主义法制国家","C．建设中国特色社会主义法制体系，建设社会主义法制国家","D．建设中国特色社会主义法制体系，建设社会主义法治国家"],"answer":"A"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》提出，法律是治国之重器，________是善治之前提。","options":["A．良法","B．守法","C．执法","D．普法"],"answer":"A"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》明确将每年的_______定为国家宪法日。","options":["A．12月1日","B．8月1日","C．12月4日","D．8月8日"],"answer":"C"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》提出，法律的生命力和法律的权威在于_______。","options":["A．实施","B．规范","C．教育","D．惩罚"],"answer":"A"},{"question":"根据《法治政府建设实施纲要（2015-2020）》，属于加强合法性审查具体措施的是______。","options":["A．组织风险评估","B．坚持集体讨论决定","C．未经合法性审查可以先提交讨论","D．建立法律顾问队伍"],"answer":"D"},{"question":"根据《法治政府建设实施纲要（2015-2020）》要求，海关系统要落实________的普法责任制。","options":["A．“谁负责谁普法”","B．“谁管理谁普法”","C．“谁立法谁普法”","D．“谁执法谁普法”"],"answer":"D"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》提出，实现依法治国总目标必须坚持中国共产党的领导、_______原则。","options":["A．坚持人民主体地位","B．坚持法律面前人人平等","C．坚持依法治国和以德治国相结合","D．坚持从中国实际出发"],"answer":"ABCD"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》明确了全面推进依法治国的重大任务，包括：","options":["A．完善以宪法为核心的中国特色社会主义法律体系，加强宪法实施","B．深入推进依法行政，加快建设法治政府","C．保证公正司法，提高司法公信力　　","D．增强全民法治观念，推进法治社会建设"],"answer":"ABCD"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》提出，加快建设法治政府，必须______________。","options":["A．依法全面履行政府职能","B．健全依法决策机制","C．坚持严格规范公正文明执法","D．强化对行政权力的制约和监督"],"answer":"ABCD"},{"question":"根据《党政领导干部选拔任用工作条例》的规定，选拔任用党政领导干部，必须坚持的原则是：","options":["A．党管干部原则","B．五湖四海、任人唯贤原则","C．德才兼备、以才为先原则","D．注重实绩、群众公认原则"],"answer":"ABD"},{"question":"根据《党政领导干部选拔任用工作条例》的规定，________不得列为考察对象。","options":["A．群众公认度不高的","B．近三年年度考核结果有被确定为基本称职以下等次的","C．有跑官、拉票行为的","D．配偶已移居国（境）外或者没有配偶，子女均已移居国（境）外的"],"answer":"ABCD"},{"question":"_____________，属于违反选拔任用党政领导干部纪律。","options":["A．擅自设置职务名称的","B．私自泄露讨论决定干部有关情况的","C．在机构变动时，突击提拔、调整干部的","D．在干部身份、年龄、工龄、党龄、学历、经历等方面弄虚作假的"],"answer":"ABCD"},{"question":"根据《法治政府建设实施纲要（2015-2020）》，到2020年基本建成职能科学、权责法定、_________的法治政府。","options":["A．执法严明","B．公开公正","C．廉洁高效","D．守法诚信"],"answer":"ABCD"},{"question":"根据《法治政府建设实施纲要（2015-2020）》，法治政府的衡量标准包括：","options":["A．政府职能依法全面履行","B．行政决策科学民主合法","C．宪法法律严格公正实施","D．行政权力规范透明运行"],"answer":"ABCD"},{"question":"根据《法治政府建设实施纲要（2015-2020）》，完善行政执法程序应当做到_____________________。","options":["A．明确行政执法具体操作流程","B．建立执法全过程记录制度","C．健全行政执法调查取证制度","D．严格执行重大行政执法决定法制审核制度"],"answer":"ABCD"},{"question":"根据《法治政府建设实施纲要（2015-2020）》规定，加强人民调解工作要完善_______联动工作体系。","options":["A．人民调解","B．行政调解","C．司法调解","D．自行调解"],"answer":"ABC"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》提出，党的领导和社会主义法治是一致的，社会主义法治必须坚持党的领导，党的领导必须依靠社会主义法治。","options":["正确．","错误．"],"answer":"正确"},{"question":"《中共中央关于全面推进依法治国若干重大问题的决定》要求，切实保证宪法法律有效实施，决不允许任何人以任何借口任何形式以言代法、以权压法、徇私枉法。","options":["正确．","错误．"],"answer":"正确"},{"question":"党政领导干部辞职或者调出的，一般应当免去现职。","options":["正确．","错误．"],"answer":"正确"},{"question":"《法治政府建设实施纲要（2015-2020）》要求坚持严格规范公正文明执法。","options":["正确．","错误．"],"answer":"正确"},{"question":"《法治政府建设实施纲要（2015-2020）》要求，全面实行行政执法人员持证上岗和资格管理制度，未经执法资格考试合格，不得授予执法资格，不得从事执法活动。","options":["正确．","错误．"],"answer":"正确"},{"question":"《法治政府建设实施纲要（2015-2020）》要求把法治观念强不强、法治素养好不好作为衡量干部德才的重要标准。","options":["正确．","错误．"],"answer":"正确"}
    // ];

    return {
        getQuestion:function(id){
            if(id<questions.length){
                return questions[id];
            }else{
                return false;
            }
        },
        loadQuestion:function(q){
            questions = q;
        },
        total:function()
        {
            return questions.length;
        },
        load:function(quizName)
        {
            return $http.get(quizName);
        }
    };
});

app.controller('quizController',function($scope,$http,quizFactory){
    $scope.quizName = '1.json';
    
    // $http.get($scope.quizName).then(function(response){
    //     $scope.questions = response.data;
    //     quizFactory.loadQuestion(response.data);
    // });

    quizFactory.load($scope.quizName).then(function(response){
             $scope.questions = response.data;
             quizFactory.loadQuestion(response.data);
         });
    
});