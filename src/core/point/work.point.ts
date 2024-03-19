import { JSDOM } from 'jsdom'
import type { Course, Job, JobInfo } from '../../utils/decode'
import { CX_API } from '../../api'
import { BasePoint } from './base.point'

const QuestionType = {
  单选题: 0,
  多选题: 1,
  填空题: 2,
  判断题: 3,
  简答题: 4,
  名词解释: 5,
  论述题: 6,
  计算题: 7,
  其它: 8,
  分录题: 9,
  资料题: 10,
  连线题: 11,
  排序题: 13,
  完型填空: 14,
  阅读理解: 15,
  口语题: 18,
  听力题: 19,
  共用选项题: 20,
  测评题: 21,
}
const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<script>
    _HOST_ = "//mooc1-api.chaoxing.com";
    _CP_ = "/mooc-ans";
    _HOST_CP1_ = "//mooc1-api.chaoxing.com/mooc-ans";
    // _HOST_CP2_ = _HOST_ + _CP_;
    _HOST_CP2_ = _CP_;
</script><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, target-densitydpi=medium-dpi, initial-scale=1, user-scalable=no"/>
<meta name="format-detection" content="telephone=no"/>
<title>已批阅</title>
<link href="//mooc1-api.chaoxing.com/mooc-ans/css/work/phone/basic-s.css?v=2023-0619-1500" rel="stylesheet" type="text/css" />
<link href="//mooc1-api.chaoxing.com/mooc-ans/css/work/phone/css-s.css?v=2019-1025-1645" type="text/css" rel="stylesheet"/>
<link rel="stylesheet" href="//mooc1-api.chaoxing.com/mooc-ans/css/work/phone/s/css/style-normal.css?v=2024-0129-1600" />
<link rel="stylesheet" href="//mooc1-api.chaoxing.com/mooc-ans/css/work/phone/s/connLine-ceyan.css" />
<link rel="stylesheet" type="text/css" href="//mooc1-api.chaoxing.com/mooc-ans/css/course/topbar.css?v=2022-0527-1100"/>
<link href="//mooc1-api.chaoxing.com/mooc-ans/css/work/viewer.min.css" rel="stylesheet" type="text/css" />
<link href="//mooc1-api.chaoxing.com/mooc-ans/css/questionBank/questionBankUsual.css?v=2019-1120-1400" type="text/css" rel="stylesheet"/><link href="//mooc1-api.chaoxing.com/mooc-ans/mooc2/css/font.css?v=2023-0908-1500" rel="stylesheet" type="text/css" /><link rel="stylesheet" type="text/css" href="//mooc1-api.chaoxing.com/mooc-ans/mooc2/css/oralTest.css?v=2022-0726-1100" />
<link rel="stylesheet" type="text/css" href="//mooc1-api.chaoxing.com/mooc-ans/css/work/phone/s/css/edit.css?v=2024-0104-1736" />
<style>
img { height: auto; width:auto; max-width:80%;max-height:80%;}
</style>
<script type="text/javascript" src="//mooc-res2.chaoxing.com/mooc-ans/js/common/jquery.min.js"></script>
<script type="text/javascript" src="//mooc-res2.chaoxing.com/mooc-ans/js/common/jquery-migrate.min.js"></script><script src="//mooc1-api.chaoxing.com/mooc-ans/static/js/domain.js"></script>
<script src="//mooc-res2.chaoxing.com/mooc-ans/js/phone/zepto-1.1.6.min.js"></script>
<script src="//mooc-res2.chaoxing.com/mooc-ans/js/phone/touch-1.1.6.js"></script>
<script src="//mooc1-api.chaoxing.com/mooc-ans/js/phone/fx_methods-1.1.6.js"></script>
<script src="//mooc1-api.chaoxing.com/mooc-ans/js/phone/fx-1.1.6.js"></script>
<script src="//mooc1-api.chaoxing.com/mooc-ans/js/phone/radialindicator.js"></script>
<script>window.UEDITOR_HOME_URL= '/ananas/ueditor/';</script>
<script src="/ananas/ext/ed_complete.js"></script>
<script src="//mooc1-api.chaoxing.com/mooc-ans/js/phone/rem750s1.js"></script>
<script src="//mooc1-api.chaoxing.com/mooc-ans/js/ServerHost.js"></script>
<script src="//mooc-res2.chaoxing.com/mooc-ans/js/work/phone/fix-svg-path.js"></script>
<script type="text/javascript" src="//mooc1-api.chaoxing.com/mooc-ans/js/common/viewer.js"></script>
<script type="text/javascript" src="//mooc1-api.chaoxing.com/mooc-ans/js/common/jquery-viewer.min.js"></script>
<script src="//mooc1-api.chaoxing.com/mooc-ans/js/work/phone/work-attach.js?v=2024-0228-1600"></script><script src="//mooc1-api.chaoxing.com/mooc-ans/js/work/phone/attach-mark.js?v=2023-1026-1600"></script>
<script type="text/javascript">window.SUPPORT_AUDIO_SETTING = true; window.SUPPORT_AUDIO_CONTROL = true;</script>
<script src="//mooc1-api.chaoxing.com/mooc-ans/js/work/work-audio-playtimes.js?v=2024-0104-1500"></script>

<input type="hidden" id="fromDevice" value="mobile"/>

<div class="maskDiv" style="display:none;z-index:1000;" id="audioLimitTimesWinNew">
    <div class="popSetDiv wid440">
        <div class="popHead RadisTop">
            <a href="javascript:;" class="popClose fr" onclick="$('#audioLimitTimesWinNew').fullFadeOut();">
                <img src="//mooc1-api.chaoxing.com/mooc-ans/mooc2/images/popClose.png"/>
            </a>
            <p class="fl fs18 color1">提示</p>
        </div>
        <div class="het62"></div>
        <p class="popWord fs16 color2 audioLimitTimesTip">此附件仅支持打开 <span></span> 次，你已打开 <span></span> 次，不能再次打开</p>
        <div class="popBottom RadisBom">
            <a href="javascript:;" class="jb_btn jb_btn_92 fr fs14" onclick="$('#audioLimitTimesWinNew').fullFadeOut();">知道了</a>
        </div>
        <div class="het72"></div>
    </div>
</div>

<div class="AlertCon02" style="width:400px; height:200px;display:none;" id="audioLimitTimesWin">
    <h3 class="clearfix">
        <a href="javascript:;" class="closed02 fr" onclick="WAY.box.hide();$('#audioLimitTimesWin').css('display','none')" style="margin-top:1px;"></a>
    </h3>
    <div class="con03">
        <p class="audioLimitTimesTip" style="margin-top:16px;text-align:left;">此附件仅支持打开 <span></span> 次，你已打开 <span></span> 次，不能再次打开</p>
        <div style="margin-top:60px;">
            <a class="bluebtn" href="javascript:;" onclick="WAY.box.hide();$('#audioLimitTimesWin').css('display','none')">知道了</a>
        </div>
    </div>
</div><script type="text/javascript"> 
     EXAM_I18N_Config = {
     	'nodata': '暂无数据',
     	'courseinfo': '课程信息',
     	'analysisClass': '分析班级',
     	'courseTeacher': '任课教师',
     	'teamTeacher': '教师团队',
     	'className': '班级名称',
     	'numberOfStudents': '学生数',
     	'score': '分',
     	'ZGF': '最高分',
     	'ZDF': '最低分',
     	'pblavag': '平均分',
     	'passingRate': '及格率',
     	'excellentRate': '优良率',
     	'standardDeviation': '标准差',
     	'variance': '方差',
		'excellentDes': '优秀',
        'goodDes': '良好',
        'mediumDes': '中等',
        'passDes': '及格',
        'belowDes': '以下',
        'scoreDistributionChart': '成绩分布图',
        'scoreComparisonChart': '成绩对比图',
        'scoreRank': '成绩排名',
        'crs': '人数',
        'noPass': '不及格',
        'percentage': '比例',
        'excellentAndGood': '优良',
        'general': '一般',
        'FS': '分数',
        'zuoye': '作业',
        'ClassroomInteraction': '课程积分',
        'attendance': '签到',
        'videoWeight': '课程音视频',
        'chaptertest': '章节测验',
        'visittimes': '章节学习次数',
        'talk': '讨论',
        'reader': '阅读',
        'live': '直播',
        'test': '考试',
        'reward': '奖励',
        'offline': '线下',
        'weightItem': '权重项',
        'weight': '权重',
        'weightItemDes': '权重项说明',
        'examWeightTip': '所有考试的平均分',
        'homework': '作业',
        'homeworkWeightTip': '按在线作业的平均分计分。如设置作业明细分配，则按（按班级发放的作业成绩*权重占比＋按人发放的作业成绩)/(1＋按人发放的作业数量）或按班级发放的作业成绩*权重占比计分',
        'ClassroomInteractionTip1': '参与投票、问卷、抢答、选人、讨论、随堂练习等课程活动可以获得相应分数，积分达',
        'ClassroomInteractionTip2': '分为满分',
        'attendanceTip1': '按次数累计，每签到一次+1，签到数达',
        'attendanceTip2': '次为满分',
        'courseVideo': '课程视频',
        'videoWeightTip': '课程视频/音频全部完成得满分,单个视频/音频分值平均分配，满分100分',
        'coursetestWeightTip': '只计算为任务点的章节测验,取学生章节测验平均分,未做测验按“0”分计算',
        'PBLWeightTip': '学生在每个分组任务活动获得的分数取平均分',
        'pvWeightTip1': '章节学习次数达',
        'bbsWeightTip1': '发表或回复一个讨论得',
        'AppreciateDes': '获得一个赞得',
        'bbsWeightTip3': '最高100分',
        'reading': '阅读',
        'readingWeightTip1': '按阅读课程中阅读材料的时长计分，总时长达到',
        'readingWeightTip2': '分钟为满分',
        'liveWeightTip1': '观看章节中的直播、直播回放总时长达到',
        'liveWeightTip2': '分钟为满分',
        'rewardScoreTip': '教师对学生的奖励加分,奖励积分',
        'offlineWeightTip': '学生线下学习行为得分',
        'saving': '正在保存...',
        'saveSuccess': '保存成功',
        'saveFailed': '保存失败',
        'loadData': '正在加载数据...',
        'adding': '正在添加...',
        'addFailureTip': '添加失败,稍后再试',
        'deleteTip': '正在删除...',
        'deleteFailureTip': '删除失败,稍后再试',
        'moving': '正在移动...',
        'moveFailureTip': '移动失败,稍后再试...',
        'selectClassTip': '请选择班级！',
         'noCheckConditionTips':'您还没有选择提醒的条件',
         'warningWay':'提醒方式',
         'ImmediateWarning':'立即提醒',
         'automaticWarning':'自动提醒',
         'singleSupervisionAndPromotion':'单次提醒',
         'cycleSupervision':'循环提醒',
         'urgeTime':'提醒时间',
         'superviseTheCycle':'提醒频率',
         'weekly':'每周',
         'everyTwoWeeks':'每两周',
         'everyThreeWeeks':'每三周',
         'every4Weeks':'每四周',
         'superviseTheLengthOfTime':'持续时长',
         'oneMonth':'1个月',
         'TMonth':'2个月',
         'SMonth':'3个月',
         'FMonth':'4个月',
         'FiMonth':'5个月',
         'SMonth':'6个月',
         'notStudyTips':'同学你好，您有课程学习进度未达标，请加快学习进度。在本课程中以下条件未达标:',
         'checkDate':'请选择日期',
         'hellouser': '用户，您好',
         'clickToEditQuestion': '请在上方点击题型按钮添加题目，然后在此编辑区添加内容',
         'coursename': '课程名称',
         'PBLWeight': '分组任务（PBL）',
         'qBankTip1':'请输入试题的内容',
         'qBankTip2':'请设置正确答案',
         'qBankTip3':'确认修改？',
         'testTimeOverSubmitTip':'作答时间耗尽，试卷已提交',
         'testReceiveTime':'试卷领取时间：',
         'stuTestUseTime':'考试用时：',
         'minute':'分钟',
         'confirmKnow':'知道了',
         'confirm':'确定',
         'leavetip2':'次，将强制收卷',
         'leavetip1':'系统检测到你已离开考试',
         'leavetip3':'系统检测到学生考试多终端，将强制收卷',
         'leavetip6':'系统检测到屏幕异常',
         'submitExam':'您确定要交卷吗?',
         'worksubmitTips2':'，确认提交吗？',
         'worksubmitTips1':'您还有未做完的',
         'shoujuantz':'收卷通知',
         'zhuapaiTip':'本次考试需要进行屏幕抓拍，系统需要开启您的屏幕录制权限，请确认同意',
         'reEnter':'重新进入',
         'cancel':'取消',
         'notLeaveTip1':'系统检测到你于',
         'notLeaveTip2':'离开考试，请不要中途离开。',
         'exitExam1':'离开考试提示',
         'littleUnDo':'此题目仍有小题未作答，继续作答下一题？',
         'littleUnDo2':'此题目仍有小题未作答，确认继续？',
         'continueexam':'继续考试',
         'exitExamTitle':'退出考试',
         'projectionScreenTip':'检测到有其他应用正在投屏/共享屏幕，请关闭后进入考试',
         'exitDurationTipPrerix':'系统检测到你的切屏时长已超过',
         'exitDurationTipSuffix':'秒，将强制收卷',
         'forceSubmitTip':'考试已被提交',
         'forceSubmitStyle1Tip':'你已被老师收卷',
         'examScreenAbnormalTitle':'屏幕异常提示',
         'examScreenAbnormalTip':'系统检测到你于[0]屏幕出现异常，您已被检测到屏幕异常[1]次，屏幕异常[2]次将强制收卷，请关闭与考试无关页面。',
         'exitForceSubmitExamTip':'系统检测到曾退出考试，将强制收卷',
         'secondDeviceLiveOpenTip':'检测到未按考试要求开启第二设备直播，请确认直播已开启',
         'appeal':'申诉',
         'allowAnswerBackTips':'本场考试设置了不允许查看上一题，当前题目未作答，确认继续作答下一题？',
         'delayReminder':'延时提醒',
         'teacherDelayOperate':'该考试教师进行延时操作',
         'delayDuration':'延时时长：[1]分钟',
         'delayReason':'延时原因：[1]'
	 };
</script>
<script>
	$(function(){
		if (parent != this) {
			var workIframe = parent.document.getElementById("frame_content");
			if(workIframe) {
				var oldHeight = workIframe.style.height;
				workIframe.style.height = '0';
				try {
					parent.dynIframeSize(workIframe);
					if (workIframe.style.height == '0' || workIframe.style.height == '0px') {
						workIframe.style.height = oldHeight;
					}
				} catch (e) {
					workIframe.style.height = oldHeight;
				}
			}
		}
		window.setInterval(function(){
			try{
				if (parent != this) {
					parent.dynIframeSize(parent.document.getElementById("frame_content"));
				}
			}catch(e){}
		}, 200);

		//查看解析
		$('.viewAnalysis').on('click', function () {
			if(!$(this).hasClass("rotate180") && $(this).hasClass("voteAnalysis")){
				var len = $(this).next().find(".prg-cont-wrap").children().length;
				if(len == 0){
					var questionId = $(this).attr("data-param");
					voteStatistic($(this).next().find(".prg-cont-wrap"),questionId);
				}
			}
			$(this).toggleClass('rotate180');
			$(this).siblings('.analiysis').slideToggle();

		});
		
		$(".viewAttach").find("span:first").each(function(){
			$(this).attr("onclick", "viewMark(this);");
		});
    });
</script>
<style>
	html, body,h1, h2, h3, h4, h5, h6{font:14px/1.5 PingFangSC,微软雅黑, 黑体, Arial, Helvetica, sans-serif}
	.Py-m1-title{background:#fafafa;}
	pre{white-space: pre-wrap;}
	.answerList li{padding:0.16rem 0 0;}
	pre{white-space: pre-wrap;}
	.answerList li p{width:100%!important;font-size:0.32rem;line-height:0.56rem;padding: 0;}
	.numberDiv em{color:#7b9e31;}

	.pad30{padding:0rem;}
	.Ic_span{display:inline-block;width:.8rem;height:.8rem;border-radius:.08rem;overflow:hidden}
	.Ic_span img{width:100%;height:100%;max-width:100%;max-height:100%;}
	.wid400{width:100%;display: flex;align-items: center;/*justify-content: center;*/height: .92rem;}
	.wid400 p{display:block;width:6rem;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;line-height:.46rem;color:#000;font-size:.34rem}
	.hetNumber{font-size:.26rem;color:#999;}
	.finish{font-size:.24rem;color:#00B86E;display:block;width:0.8rem;line-height:0.33rem;text-align:center;}
	.hetNumber i{display:block;width:.44rem;height:.44rem;margin-left: 0.18rem;background:url(//mooc1-api.chaoxing.com/mooc-ans/images/work/phone/green_right.png) no-repeat;background-size:100%;margin-bottom:0.1rem;}
    .hetNumber3{font-size:.26rem;color:#999;}
    .finish3{font-size:.24rem;color:#E88C17;display:block;width:0.8rem;line-height:0.33rem;text-align:center;}
    .hetNumber3 i{display:block;width:.44rem;height:.44rem;margin-left: 0.18rem;background:url(//mooc1-api.chaoxing.com/mooc-ans/images/work/phone/work-pend-icon.png) no-repeat;background-size:100%;margin-bottom:0.1rem;}
    .redoBtn{display:inline-block;width:0.24rem;height:.24rem;margin-top:1px;background: url("//mooc1-api.chaoxing.com/mooc-ans/css/work/phone/s/images/redo.png") no-repeat left center;background-size: 100%;margin-right:0.16rem;}
	.borderBom{border-bottom:1px solid #EBEBEB;}
	.nowNmber{font-size:.3rem;color:#999;padding:.24rem 0 .3rem .3rem}
	.padCon{padding: 0.4rem 0.3rem 0.36rem;box-shadow:0px -1px 0px 0px #f2f2f2;}
	.answer{ border-top:0;border-bottom: none;padding:0;line-height:0.42rem;font-size:0.3rem;padding-top:0.2rem}
	.Py-mian1{box-shadow:inset 0px -0.5px 0px #EBEBEB;padding: 0.5rem 0.3rem;}
	.afterTj{background:none; padding:0;border:none;}
	.Py-m1-title{background:none;font-size: 0.32rem;line-height: 0.56rem;color: #333;padding:0;}
	.bgColor{background:none}
	.answerList{padding:0 0 0.4rem;}
	.b1{border: 0.02rem solid #F2F2F2;border-radius: 0.12rem;background:#fff}
	.cyTag{height:0.6rem;width:100%;background:#F8F8F8;line-height:0.6rem;border-radius:0.12rem 0.12rem 0 0;font-size:0.26rem}
	.c1{margin-left:0.3rem;font-size:0.26rem;color:#999}
	.answer em{display:block;font-size:0.3rem;line-height:0.42rem;font-weight:600;color:#333;}
	.padRight{padding:0 0 0.2rem;}
    .pd,.cuo,.halfRight{width:0.44rem;height:0.44rem;margin-top:0;}
	.wrIcon img{width:0.44rem;height:0.44rem;margin-top:0;max-width: 100%;max-height: 100%;}
	.quesType{color:#999}
	.answer em i{font-weight:600;}
	.answer em p{font-weight:400;}
	.answerItem{font-weight:400;font-size:0.3rem;line-height:0.52rem;padding-top: 0.1rem;}
	.answerItem p{display:inline}
	.myAnswer{font-weight:600;font-size:0.3rem;line-height:0.42rem;}
	.pdt40{padding-top:0.4rem}
	.pdt20{padding-top:0.2rem;}
	.answerDetail{flex: 1;}
	.my-answer-item {margin-top: 0.1rem;display: flex;align-items: start;font-size: 0.3rem;line-height: 0.52rem;color: #333333;}
	.fw400{font-weight:400;}
	.afterAnswer .lh56{line-height:0.56rem;font-weight: 600;padding-bottom:0.04rem;}
	.afterAnswer{padding:0;font-size:0.3rem;}
	.afterAnswer p{line-height:0.52rem;color:#333;}
	.scoreNum span{line-height:0.37rem;font-size:0.26rem;color:#999;padding-right:0.28rem;}
	.redo{padding: 0.46rem 0.3rem 0.5rem;}
	.answerpla{border-top:none;}
	.cyTips{padding-top:.1rem;color: #FF8800;margin-bottom:.36rem;display:block}
	.time-icon{display:inline-block;width:.36rem;height:.36rem;background:url("//mooc1-api.chaoxing.com/mooc-ans/images/work/phone/time-icon.png") no-repeat;background-size:100%;vertical-align: middle;margin-right: .1rem;}
	.answerList li p {display: inline; float: none;}
    .wrIcon {    margin-left: 0.2rem;width: 0.44rem;height: 0.44rem;}
	.spanYellow{color:#F28B24;padding:0 5px;}
	.changeTimes{font-size: .3rem;color: #09f;margin-top:.2rem;display:block;margin-top:.2rem;}
	.changeTimes i{display: inline-block;width: 0.55rem;height: 0.55rem;vertical-align: middle;margin-top: .06rem;}
	.changeTimes i img{display:block;width:100%;height:100%;}
	.viewer-button {right: 15px;background: url(//mooc1-api.chaoxing.com/mooc-ans/images/work/icon.png) no-repeat -255px -3px;width: 50px;}
	.knowledgePoint{border:solid .02rem #F2F2F2;border-left:.1rem solid #E1E7F0;padding:0 .32rem .32rem .32rem;border-radius:.06rem;margin-top:.4rem}
	.pointTitle{font-size:.3rem;line-height:.42rem;font-weight:600;margin-top:.32rem}
	.poinList{overflow: hidden;}
	.poinList li{float:left;max-width:3.2rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding:.08rem .2rem;border:solid .02rem #CCC;border-radius:.08rem;margin-right:.2rem;margin-top:.2rem;font-size:.28rem;color:#666;line-height:.36rem}
	.topicComments{margin-top:.12rem;font-size:.3rem;line-height:.48rem;color:#333}
</style>
<link rel="stylesheet" type="text/css" href="//mooc1-api.chaoxing.com/mooc-ans/css/phone/pad/chapterPadStyle.css?v=2024-0122-1801" />
</head>
<body>
<input type="hidden" id="openChapterVideo" value="1"/>

<input type="hidden" id="courseId" value="241542309" />
<input type="hidden" id="cpi" value="210515151" />
<input type="hidden" id="workId" value="32588668" />
<input type="hidden" id="mooc" value="0" />
<input type="hidden" id="knowledgeid" value="818440044" />
<input type="hidden" id="jobid" value="work-266de777bde54f81ad7dc8f8a1286f95" />
<input type="hidden" id="enc" value="e4cc4cfc2b10bb3ba5c1b04b8584a671" />
<input type="hidden" id="workAnswerId" value="53044783" />
<input type="hidden" id="answerId" value="53044783" />
<input type="hidden" id="classId" value="94400507" />
<input type="hidden" id="creatorId" value="210515151" />

<div class="pad30 b1 main-box">
	<div class="cyTag">
		<span class="fl c1">章节测验</span>
	</div>
	<div class="grayBg">
		<div class="chapter-content">
			<div class="left-content">
				<h3 class="chapter-title">1.1</h3>
													<div class="score-box">
						<span>本次得分: 100</span>
											</div>
											</div>
			<div class="right-content">
									<div class="hetNumber">
						<i></i>
						<span class="finish">已完成</span>
					</div>
							</div>
		</div>
	</div>
	
				
	    
     	
			
			
									    		<div class="Py-mian1" style="margin-top:0;border:none;">
    			<div>
            		<div class="Py-m1-title fs16 fontLabel singleQuesId" data="212672713" tabindex="0"  role="text" >
            			1.<span class="quesType">[单选题]</span>下列各项中，不属于进一步推动中国经济回升向好需要克服的困难和挑战的是（）。
						        			</div>
            		        					<ul class="answerList bgColor answerListAfter">
    	    	    		    		<li class="clearfix" tabindex="0"  role="text" ><div>A.部分产业产能过剩</div></li>
            		    		<li class="clearfix" tabindex="0"  role="text" ><div>B.社会预期偏弱</div></li>
            		    		<li class="clearfix" tabindex="0"  role="text" ><div>C.风险隐患仍然较多</div></li>
            		    		    		<li class="clearfix" tabindex="0"  role="text" ><div>D.消费市场持续低迷</div></li>
            </ul>
   <div class="answer">
		    			    				            			<span class="fr pd"></span>
            		        					   		   <em class="padRight" tabindex="0"  role="text" >我的答案：<i>D</i></em>
	   			   		   <em style="padding-top:0.2rem" tabindex="0"  role="text" >得分：<i>25.0分</i></em>
	   
   </div>
            								        		</div>
    		</div>
					
			
									    		<div class="Py-mian1" style="margin-top:0;border:none;">
    			<div>
            		<div class="Py-m1-title fs16 fontLabel singleQuesId" data="212672711" tabindex="0"  role="text" >
            			2.<span class="quesType">[单选题]</span>关于2023年中国经济社会发展，下列说法中错误的是（）。
						        			</div>
            		        					<ul class="answerList bgColor answerListAfter">
    	    	    		    		<li class="clearfix" tabindex="0"  role="text" ><div>A.现代化产业体系建设取得重要进展</div></li>
            		    		<li class="clearfix" tabindex="0"  role="text" ><div>B.安全发展基础巩固夯实</div></li>
            		    		<li class="clearfix" tabindex="0"  role="text" ><div>C.科技创新实现新的突破</div></li>
            		    		    		<li class="clearfix" tabindex="0"  role="text" ><div>D.高通胀和高利率挤压消费者支出</div></li>
            </ul>
   <div class="answer">
		    			    				            			<span class="fr pd"></span>
            		        					   		   <em class="padRight" tabindex="0"  role="text" >我的答案：<i>D</i></em>
	   			   		   <em style="padding-top:0.2rem" tabindex="0"  role="text" >得分：<i>25.0分</i></em>
	   
   </div>
            								        		</div>
    		</div>
					
			
									    		<div class="Py-mian1" style="margin-top:0;border:none;">
    			<div>
            		<div class="Py-m1-title fs16 fontLabel singleQuesId" data="212672714" tabindex="0"  role="text" >
            			3.<span class="quesType">[多选题]</span>我国的改革开放事业在2023年向纵深推进，其具体表现有（）。
						        			</div>
            		        					<ul class="answerList bgColor answerListAfter">
    	    	    		    		    		<li class="clearfix" tabindex="0"  role="text" ><div>A.民营经济发展活力有效激发</div></li>
            		    		<li class="clearfix" tabindex="0"  role="text" ><div>B.持续推动市场准入收紧</div></li>
            		    		    		<li class="clearfix" tabindex="0"  role="text" ><div>C.重点领域和关键环节改革持续深化</div></li>
            		    		    		<li class="clearfix" tabindex="0"  role="text" ><div>D.国有企业发展质量效益持续提升</div></li>
            </ul>
   <div class="answer">
		    			    				            			<span class="fr pd"></span>
            		        					   		   <em class="padRight" tabindex="0"  role="text" >我的答案：<i>ACD</i></em>
	   			   		   <em style="padding-top:0.2rem" tabindex="0"  role="text" >得分：<i>25.0分</i></em>
	   
   </div>
            								        		</div>
    		</div>
					
			
									    		<div class="Py-mian1" style="margin-top:0;border:none;">
    			<div>
            		<div class="Py-m1-title fs16 fontLabel singleQuesId" data="212672715" tabindex="0"  role="text" >
            			4.<span class="quesType">[判断题]</span>我国经济回升向好、长期向好的基本趋势没有改变，我们所面临的是前进中的问题、发展中的烦恼。
						        			</div>
            		        				  <div class="answer pdt40">
		        		        			<span class="fr pd"></span>
        					  		  			  <em class="padRight" tabindex="0"  role="text">我的答案：<i class="fw400">对</i></em>
		  	  		  		  <em style="padding-top:0.2rem" tabindex="0"  role="text">得分：<i>25.0分</i></em>
	     </div>
    										        		</div>
    		</div>
				</div>
	<link rel="stylesheet" href="//mooc1-api.chaoxing.com/mooc-ans/css/phone/hint.css?v=2024-0104-1800" />
<div id="msg" class="rescan_main">
	<div class="msg-title">title</div>
	<div class="msg-content">
		<div class="msg-content-middle"></div>
		<div class="msg-content-b">
			<span class="msg-content-left msg-content-ok">确定</span>
			<span class="msg-content-right msg-content-cancel">取消</span>
		</div>
	</div>
</div>
<div id="hint" class="rescan_main">
	<div class="msg-title">title</div>
	<div class="msg-content">
		<div class="msg-content-middle"></div>
		<div class="msg-content-b">
			<p class="msg-content-cancel">确定</p>
		</div>
	</div>
</div>
<div id="time" class="rescan_main">
	<div class="msg-title">title</div>
	<div class="msg-content">
		<div class="msg-content-middle"></div>
	</div>
</div>
<div id="confirm" class="rescan_main">
	<div class="msg-title"></div>
	<div class="msg-content">
		<div class="msg-content-middle"></div>
		<div class="msg-content-b">
			<span class="msg-content-left msg-content-ok"></span>
			<span class="msg-content-right msg-content-cancel"></span>
		</div>
	</div>
</div>

<div id="noticeConfirm" class="rescan_mainNew">
	<div class="notice-title"></div>
	<div class="msg-contentNew">
		<div class="notice-content-middle"></div>
		<div class="msg-content-bNew">
			<span class="msg-content-leftNew msg-content-okNew" style="width:100%;"></span>
		</div>
	</div>
</div>

<div id="mask" class="black_overlay"></div>
<script src="//mooc-res2.chaoxing.com/mooc-ans/js/phone/hint.js?v=2023-0803-0030"></script><link rel="stylesheet" href="//mooc1-api.chaoxing.com/mooc-ans/css/statistic/phone/circle.css?v=1" />
<div class="Wrappadding" id="Wrappadding">
	<div class="ui-loader ui-corner-all ui-body-a ui-loader-default"><span class="ui-icon ui-icon-loading"></span></div>
</div><style>
.cx_alert { position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: #000; opacity: 0.4; display:none; z-index:10000;}
.cx_alert-box { position: fixed; left: 50%; top: 30%; width: 72%; height: auto; margin-left: -36%; display:none; z-index:10001;}
.cx_alert-content { padding: 0.351rem 0.3276rem;  border-radius: 0.234rem 0.234rem 0 0;  background: #fff; text-align: center; color: #333; font-size: 0.2574rem;}
.cx_alert-txt { padding-top: 0.117rem; line-height: 0.48rem;font-size:0.32rem;}
.cx_alert-btn { border-top: 0.5px solid #EBEBEB; border-radius: 0 0 0.234rem 0.234rem ; overflow: hidden; }
.cx_alert-btn ul { display: -webkit-box; display: box; }
.cx_alert-blue, .cx_alert-black { -webkit-box-flex: 1; box-flex: 1; height: 0.936rem; background: #fff; line-height: 0.936rem; text-align: center; font-size: 0.32rem; color: #09f;}
.cx_alert-black { color: #0099FF;}
.cx_alert-blue:not(:last-child),
.cx_alert-black:not(:last-child) { border-right: 0.5px solid #EBEBEB}

.cx_box { display: -webkit-box; -webkit-box-orient: vertical;  height: 100vh;}
.cx_box-top { position: relative; width: 100%; height: 0.0023rem; z-index:100000;}
.cx_box-content { -webkit-box-flex: 1;  -webkit-overflow-scrolling:touch; overflow:hidden; overflow-y:auto; }
.cx_box-footer { position: relative; width: 100%;  height: 1.0764rem; z-index: 100;}
.cx_box-bottom { height: 0.0023rem;}
.loading{width:.4rem; height:4rem; position:fixed; left:50%; top:30%; margin-left:-.2rem; display: none;}
</style>

<article class="cx_alert" id="cxAlert1" style="display: none;"></article>
<article class="cx_alert-box" id="cxAlertBox1" style="display: none;">
	<div class="cx_alert-content">
		<div class="cx_alert-txt" id="cxAlertTxt1"></div>
	</div>
	<div class="cx_alert-btn">
		<ul>
			<li class="cx_alert-black" id="cancelBtn">取消</li>
			<li class="cx_alert-blue" id="okBtn">确定</li>
		</ul>
	</div>
</article>

<div class="loading" id="alertLoading1"><img src="//mooc1-api.chaoxing.com/mooc-ans/images/loading.gif"/></div>

<script>
function loading() {
	$("#cxAlert1").css("display", "block");
	$("#alertLoading1").css("display", "block");
}

function loadingClose() {
	$("#cxAlert1").css("display", "none");
	$("#alertLoading1").css("display", "none");
}

function workPop(content, okTent, okcallback, cancelCallback) {
	var ta = $("#cxAlertBox1");
	$("#cxAlertTxt1").html(content);
	$("#okBtn").html(okTent);
	$("#cxAlert1").css("display", "block");
	$("#cxAlertBox1").css("display", "block");
	$("#okBtn").unbind();
	$("#cancelBtn").unbind();
	$("#cancelBtn").css("display", "block");
	$("#okBtn").on("click", function() {
		okcallback && okcallback(ta);
		$("#cxAlert1").css("display", "none");
		$("#cxAlertBox1").css("display", "none");
	});
	$("#cancelBtn").on("click", function() {
		cancelCallback && cancelCallback(ta);
		$("#cxAlert1").css("display", "none");
		$("#cxAlertBox1").css("display", "none");
	});
}

function workPop2(content, okTent, cancelTent, okcallback, cancelCallback) {
	var ta = $("#cxAlertBox1");
	$("#cxAlertTxt1").html(content);
	$("#okBtn").html(okTent);
	$("#cancelBtn").html(cancelTent);
	$("#cxAlert1").css("display", "block");
	$("#cxAlertBox1").css("display", "block");
	$("#okBtn").unbind();
	$("#cancelBtn").unbind();
	$("#cancelBtn").css("display", "block");
	$("#okBtn").on("click", function() {
		okcallback && okcallback(ta);
		$("#cxAlert1").css("display", "none");
		$("#cxAlertBox1").css("display", "none");
	});
	$("#cancelBtn").on("click", function() {
		cancelCallback && cancelCallback(ta);
		$("#cxAlert1").css("display", "none");
		$("#cxAlertBox1").css("display", "none");
	});
}

function workAlertPop(content, okTent) {
	$("#cxAlertTxt1").html(content);
	$("#okBtn").html(okTent);
	$("#cxAlert1").css("display", "block");
	$("#cxAlertBox1").css("display", "block");
	$("#okBtn").unbind();
	$("#cancelBtn").unbind();
	$("#cancelBtn").css("display", "none");
	$("#okBtn").on("click", function() {
		$("#cxAlert1").css("display", "none");
		$("#cxAlertBox1").css("display", "none");
		$("#cancelBtn").css("display", "block");
	});
}

function workAlertPop2(content, okTent, okcallback) {
	var ta = $("#cxAlertBox1");
	$("#cxAlertTxt1").html(content);
	$("#okBtn").html(okTent);
	$("#cxAlert1").css("display", "block");
	$("#cxAlertBox1").css("display", "block");
	$("#okBtn").unbind();
	$("#cancelBtn").unbind();
	$("#cancelBtn").css("display", "none");
	$("#okBtn").on("click", function() {
		okcallback && okcallback(ta);
		$("#cxAlert1").css("display", "none");
		$("#cxAlertBox1").css("display", "none");
	});
}

</script></body>
<script>
	var courseId = $("#courseId").val();
	var classId = $("#classId").val();
	var cpi = $("#cpi").val();
	var workId = $("#workId").val();
	var workAnswerId = $("#workAnswerId").val();
	var knowledgeid = $("#knowledgeid").val();
	var jobid = $("#jobid").val();
	var enc = $("#enc").val();

	var lock = 0;
	function redo() {
		if (lock == 1) {
			return false;
		}
		lock = 1;

				var msg = "之前答题内容会保留，确认重做？"
		
				$(".cx_alert-box").css("top", "4rem");
		workPop(msg, '确定', function() {
			redoAction();
		}, function() {
			lock = 0;
		});
			}
	function backTopPage() {
		var backUrl = $("#backUrl").val();
		window.location.href = backUrl;
	}
	function redoAction() {
		$.ajax({
			type: "get",
			url: _HOST_CP2_ + "/work/retest",
			dataType: "json",
			data: {
				"courseId": courseId,
				"classId": classId,
				"workId": workId,
				"workAnswerId": workAnswerId,
				"knowledgeid": knowledgeid,
				"jobid": jobid,
				"enc": enc,
				"cpi": cpi,
				"phone": true,
			},
			success: function (data) {
				if (data.status) {
					location.href = data.url;
				} else {
					alert(data.msg);
					lock = 0;
				}
			}
		});
	}

    function reediter() {
        location.href = "/mooc-ans/work/phone/doHomeWork?courseId=" + courseId + "&workId="
                + workId + "&knowledgeId=" + knowledgeid + "&classId=" + classId + "&workAnswerId=" + workAnswerId
                + "&jobId=" + jobid  + "&cpi=" + cpi + "&enc=" + enc;
    }

	$(".Py-mian1 img").each(function(){
		var imgSrc = $(this).attr('src');
		if(top.jsBridge && top.jsBridge.postNotification) {
			$(this).click(function () {
				var data = fixImageData(imgSrc);
				top.jsBridge.postNotification("CLIENT_PREVIEW_IMAGES", {
					imageUrls: [{
						imageUrl: data.url,
						originUrl: data.originUrl,
						getOriginSize: 1
					}],
					showIndex: 0
				});
			})
		}else {
			$(this).attr("onclick", "top.zoomImageClick('" + imgSrc + "')");
		}
	})

	$(".pyBox .py_word_con img").each(function() {
		var imgSrc = $(this).attr('src');
		$(this).attr("onclick", "top.zoomImageClick('" + imgSrc + "')");
	})

    var colors = ['#0299ff','#f57009','#00ccff','#cc66ff','#ff99ff','#2f75f7','#ffdf26','#0066ff','#00ccff','#33CC99','#D0E17D','#ef5740','#eb6877','#806256','#c1542e','#00b4ff','#36a9ce','#33cc33','#ff3333','#ef5aa1','#bcbcbc'];

    function voteStatistic (e,questionId) {
    	var workAnswerId = $("#workAnswerId").val();
    	var classId = $("#classId").val();
    	var url = _HOST_CP2_ + "/work/voteQuestionStatistic?"
    		+ "id=" + workAnswerId
    		+ "&classId=" + classId
    		+ "&questionId=" + questionId;
    	
    	$.ajax({
    		url : url,
    		type : 'get',
    		dataType : 'json',
    		success : function(data) {
    			var status = data['status'];
    			if (status == "0" || status == 0) {
    				//alert("额，投票结果统计异常啦...");
    				openWindowHint(HINT_TYPE_TIME,'','投票结果统计异常啦...',null, 1000);
    				return;
    			}
    
    			var sum = data['sum'];
    			var voteSum = data['voteSum'];
    			if (voteSum == 0) {
    				//alert("该投票题暂无学生投票.");
    				openWindowHint(HINT_TYPE_TIME,'','该投票题暂无学生投票...',null, 1000);
    				return;
    			}
    
    
    			var dataArray = data['data'];
    			
    			var int = 0;
    			for ( var index in dataArray) {
    				var obj = dataArray[index];
    				for ( var i in obj) {
    					
    					var numAndContent = obj[i];
    					
    					var conts = numAndContent.split("|");
    					var num = conts[0];
    					var content = conts[1];
    					var percent= (Math.round(num/voteSum *10000)/100).toFixed(1);
    					
    					//console.log(num+"人:"+"percent="+ percent+ "," +content);
    					if(int >=colors.length){
    						int = colors.length -1;
    					}
    					$(e).append("<div class='ansA'><div class='prg-cont rad-prg' id='indicatorContainer"+questionId + "-"+ int 
    							+"'></div><span style='color:"+ colors[int] +"'>"+ i +"："+ num +"人</span></div>");
    					
    					radialIndicator('#indicatorContainer'+questionId + "-"+int, {
    					      barColor: colors[int],
    					      barWidth: 1,
    					      initValue: 1,
    					      roundCorner: true,
    					      percentage: true
    					    }).animate(percent);
    					
    					int++;
    				}
    			}
    
    		},
    		error : function() {
    		}
    	});
    }

	var passingStandard = "0";
	var stuScore = "100.0";
	
	if(passingStandard=='null' || passingStandard==''){
	    passingStandard = '0';
	}
	
    if(parseInt(passingStandard) == 0 || parseInt(stuScore) >= parseInt(passingStandard)) {
		if (parent != this) {
			parent.ed_complete();
			var height = parent.frameElement.offsetTop;
			window.top.scrollTo(0, height);
		}
    }

    function openTimes(times) {
		var url = location.origin + _CP_ + "/work/phone/selectWorkQuestionYiPiYue?courseId=241542309&classId=94400507&cpi=210515151&workId=32588668&workAnswerId=53044783&knowledgeId=818440044&oldWorkId=266de777bde54f81ad7dc8f8a1286f95&jobId=work-266de777bde54f81ad7dc8f8a1286f95&mooc=0&ut=s&times=" + times + "#INNER";

				top.location.href = url;
			}

	function changeTimes(times) {
		var url = location.origin + _CP_ + "/work/phone/selectWorkQuestionYiPiYue?courseId=241542309&classId=94400507&cpi=210515151&workId=32588668&workAnswerId=53044783&knowledgeId=818440044&oldWorkId=266de777bde54f81ad7dc8f8a1286f95&jobId=work-266de777bde54f81ad7dc8f8a1286f95&mooc=0&ut=s&times=" + times + "#INNER";
		location.href = url;
	}
</script>
<!--处理audio 播放 -->
<link type="text/css" rel="stylesheet" href="/ananas/modules/audio/AudioPlayer2/audioplayer.css?t=20151210" />
<style>
.audioReader{width: 100%;height: 70px;} .audioplayer {height: 60px;width: 95%;left: 4%;top: 10px; }
</style>
<script type="text/javascript" src="//mooc-res2.chaoxing.com/mooc-ans/js/common/jquery.min.js"></script>
<script type="text/javascript" src="//mooc-res2.chaoxing.com/mooc-ans/js/common/jquery-migrate.min.js"></script><script type="text/javascript">
 jQuery.noConflict(); 
</script>
<script type="text/javascript" src="/ananas/modules/audio/AudioPlayer2/audioplayer.js?t=20151210"></script>
<script type="text/javascript">
function formatTime(duration) {
    if (!duration) {
        return '00:00'; 
    }
    var m = Math.floor(duration / 60);
    var s = Math.ceil(duration % 60);
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s); 
}

function renderAudio(object,data,index) {
    var showName = data.name;
    var http=data.http;
    duration  = data.duration;
    var html = [
        '<audio preload="none" controls>',
        '<source src="'+http+'" />',
        '</audio>'
    ].join('');
    
    var audioId="audio_"+index;
    var audioDiv='<div class="audioReader" id="'+audioId+'"></div>';
    jQuery(object).parent().html(audioDiv);
  
    jQuery("#"+audioId).html(html);
    jQuery("#"+ audioId +" audio").audioPlayer({
        title: showName,
        duration: data.duration
    });
}

jQuery(document).ready(function() {
  try{
       var audios=jQuery("object[type='application/x-shockwave-flash']");
       audios.each(function(index){
          if(jQuery(this).attr("data").indexOf('audioplayer') < 0) {
             return true;
          }
           var url=jQuery(this).find("param[name='flashvars']").val();
           var offset=url.indexOf("http");
           var http=url.substring(offset);
           var audioName=jQuery(this).prev().text();
           var data={"name":audioName,"http":http};
           renderAudio(this,data,index);
       });
 }catch(e){ }
});
</script> 


<!--处理video 播放 -->
<script>
function videoPlay(object,data,index){
       var playOuterDiv=[ '<div class="zcenter">',
            '<div class="zbanner">',
                    '<div id="zvideo_'+index+'" style="width:733;height:434;" width="733" height="434">',
                        '<div id="moocplayer_'+index+'"></div>',
                   ' </div>',
           '</div>',
       ' </div>'].join('');
     jQuery(object).parent().html(playOuterDiv);
	  jQuery('#moocplayer_'+index).html([
			'<video width="100%" height="100%"  poster="' + data.coverUrl+ '" preload="none"  controls="controls" webkit-playsinline>',
			'<source type="video/mp4" src="' +data.http+ '"></source>',
			'</video>'
			].join(''));
     var zplay=document.getElementById("zvideo_"+index);
     zplay.style.display="block";
     jQuery("#moocplayer_"+index+" div").css("width","87.5%");
  } 
  
  
  function checkAppVersion(versonControl_android,versonControl_ios){
        var versonControl ="";
        var userAgent = navigator.userAgent;
        var offset = userAgent.indexOf("ChaoXingStudy_");
        var stop = 0;
        if(userAgent.indexOf("_ios_phone") > -1){
            stop = userAgent.indexOf("_ios_phone");
            versonControl = versonControl_ios;
        }else if(userAgent.indexOf("_android_phone") > -1){
            stop = userAgent.indexOf("_android_phone");
            versonControl = versonControl_android;
        }
        var versionStr = userAgent.substring(offset+14,stop);
        versionStr = versionStr.split('_')[1];
        if(versionStr == undefined){
            return false;
        }
        versionStr = versionStr.replace(/_|\./g,"");
        return versionStr+'' >= versonControl;
    }
  
  jQuery(document).ready(function(){
   try{
       var maybeVideos=jQuery("a[href^='/ueditorupload/read?objectId']");
       maybeVideos.each(function(index){
           var videoName=jQuery(this).text();
           if(!videoName.endsWith(".mp4")){
              return true;
           }
           if(!checkAppVersion("3039","1000")){
               jQuery(this).attr("href","javascript:void(0);");
               jQuery(this).on('tap',function(){
                   openWindowHint && openWindowHint(HINT_TYPE_TIME,'',"暂不支持打开",null, 1000);
               });
               return true;
           }
           
           var me=this;
           var objectId=jQuery(this).attr("href").replace('/ueditorupload/read?objectId=','');
           // 获取objectId出错
           if (objectId.indexOf('&') > 0) {
               objectId = objectId.substring(0, objectId.indexOf('&'))
           }
           jQuery.ajax({
              type : 'get',
              url : '/ananas/status/'+objectId,
              dataType:'json',
               success : function(data){
                  var status=data.status;
                  if(status == 'success'){
                    var coverUrl=data.screenshot;
                    var http=data.http;
                    var data={"coverUrl":coverUrl,"http":http};
                    videoPlay(me,data,index);
                  }
               }
           });
       });
      }catch(e){ }   
        
	});
</script></html>`
export class WorkPoint extends BasePoint {
  jobInfo: JobInfo
  currentJob!: Job
  pointId: string
  constructor(
    currentCourse: Course,
    JobInfo: JobInfo,
    currentJob: Job,
    pointId: string,
  ) {
    super(currentCourse)
    this.jobInfo = JobInfo
    this.currentJob = currentJob
    this.pointId = pointId
  }

  async fetchALlWork() {
    const fetchALlWorkRawResult = await this.request
      .get(CX_API.GET_JOB_ALL_WORK, {
        searchParams: {
          courseid: this.currentCourse.courseId,
          workid: this.currentJob.workId,
          jobid: this.currentJob.jobid,
          needRedirect: 'true',
          knowledgeid: this.pointId,
          userid: this.currentCourse.uid,
          ut: 's',
          clazzId: this.currentCourse.clazzId,
          cpi: this.currentCourse.cpi,
          ktoken: this.jobInfo.ktoken,
          enc: this.currentJob.enc,
        },
      })
      .text()
    console.log(fetchALlWorkRawResult)
  }

  /**
   * 解析作业
   * @param text
   */
  decodeWork(text: string) { }
}

function decodeWork(text: string) {
  const html = JSDOM.fragment(text)
  const isBlank = html.querySelector('p .blankTips')
  if (isBlank) {
    console.log(isBlank.innerHTML)
    return
  }
  if (html.querySelector('head title')?.textContent!.includes('已批阅')) {
    console.log('已批阅')
    return
  }
  if (html.querySelector('form #form1'))
    console.log('作业未创建完成')

  const title
		= html.querySelector('h3.py-Title')?.textContent
		?? html.querySelector('h3.chapter-title')?.textContent
  const work_answer_id = html
    .querySelector('input#workAnswerId')
    ?.getAttribute('value')
  const total_question_num = html
    .querySelector('input#totalQuestionNum')
    ?.getAttribute('value')
  const work_relation_id = html
    .querySelector('input#workRelationId')
    ?.getAttribute('value')
  const full_score = html
    .querySelector('input#fullScore')
    ?.getAttribute('value')
  const enc_work = html.querySelector('input#enc_work')?.getAttribute('value')
  console.log(
    '作业拉取成功',
    title,
    work_answer_id,
    total_question_num,
    work_relation_id,
    full_score,
    enc_work,
  )

  //   const question_nodes = html.querySelectorAll(".Py-mian1");
  //   const questions = Array.from(question_nodes).map((node) => {});
}

function parseQuestion(dom: DocumentFragment) {
  const question = dom.querySelector('input[id^=\'answertype\']')
  const questionId = question?.getAttribute('id')
  const questionType = question?.getAttribute('value')

  const question_value_node = dom.querySelector('div .Py-m1-title')
  const question_value = (question_value_node)?.textContent
  switch (Number(questionType)) {
    case QuestionType.单选题 || QuestionType.多选题:
    //   const options = {}
      const answer = dom
        .querySelector('input .answerInput')?.getAttribute('value') as string
      dom.querySelectorAll('li .more-choose-item').forEach((node) => {
        // const option = (node as any).
        // const optionValue = node.querySelector('input')?.getAttribute('value')
        // options[optionValue] = option;
      })
  }
}

function parseAnsweredQuestion(dom: DocumentFragment) { }
decodeWork(html)
