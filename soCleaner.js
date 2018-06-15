window.soCleaner = (function () {
    var checkBoxList = ['chkAds', 'chkHireMe', 'chkChat', 'chkHotQues', 
						'chkQuesStatus', 'chkQuesStats', 'chkHighlightQues', 
						'chkHighlightAcceptedAns', 'chkHighlightImpComments', 
						'chkFooter', 'chkAuthors', 'chkExpandComments', 'chkTopBar', 
						'chkPostEditor', 'chkPostForm', 'chkBottomNotice', 'chkQuestionFeed', 
						'chkCommunityBulletin', 'chkNewsletterAd', 'chkSidebar', 'chkAskQuestion',
						'chkPostTaglist', 'chkRelatedPosts', 'chkNegativeVotedAns'];
	
	var defaultList = ['chkAds', 'chkHireMe', 'chkChat', 'chkHotQues', 
						'chkQuesStatus', 'chkQuesStats', 
						'chkHighlightAcceptedAns', 'chkHighlightImpComments', 
						'chkFooter', 'chkAuthors', 'chkTopBar', 
						'chkPostEditor', 'chkPostForm', 'chkBottomNotice', 'chkQuestionFeed', 
						'chkCommunityBulletin', 'chkNewsletterAd', 'chkAskQuestion',
						'chkPostTaglist', 'chkRelatedPosts', 'chkNegativeVotedAns'];
						
	var mapping = [
						{'chkAds' : '.everyonelovesstackoverflow'}
						,{'chkHireMe': '#hireme'}
						,{'chkChat': '#chat-feature'}
						,{'chkHotQues':'#hot-network-questions'}
						,{'chkQuesStatus': '.question-status'}
						,{'chkQuesStats': '.question-stats'}
						,{'chkFooter': '#footer'}
						,{'chkAuthors':'.fw'}
						,{'chkTopBar':'.top-bar'}
						,{'chkPostForm':'#post-form'}
						,{'chkPostEditor':'#post-editor'}
						,{'chkBottomNotice':'.bottom-notice'}
						,{'chkQuestionFeed':'#feed-link-text'}
						,{'chkCommunityBulletin':'.community-bulletin'}
						,{'chkNewsletterAd':'#newsletter-ad'}
						,{'chkSidebar':'#sidebar'}
						,{'chkAskQuestion' : '.aside-cta'}
						,{'chkPostTaglist': '.post-taglist'}
						,{'chkRelatedPosts': '.sidebar-related'}
						,{'chkNegativeVotedAns': '#answers .vote-count-post'}
						];
						
	var tourMessages =  [{'chkAdsTour' : 'Click to hide google ads.'}
							,{'chkHireMeTour': 'Click to hide job section.'}
							,{'chkChatTour': 'Click to hide chat.'}
							,{'chkHotQuesTour':'Click to hot network questions.'}
							,{'chkQuesStatusTour': 'Click to hide Question Status section (for example: marked as duplicate).'}
							,{'chkQuesStatsTour': 'Click to hide Question Stats.'}
							,{'chkFooterTour': 'Click to hide footer.'}
							,{'chkAuthorsTour':'Click to hide which authors question or answered.'}
							,{'chkTopBarTour':'Click to hide the top bar.'}
							,{'chkPostFormTour':'Click to hide the Post Form.'}
							,{'chkPostEditorTour':'Click to hide the Post Editor'}
							,{'chkBottomNoticeTour':'Click to hide the bottom notice.'}
							,{'chkQuestionFeedTour':'Click to hide the feed.'}
							,{'chkCommunityBulletinTour':'Click to hide the community bulletin.'}
							,{'chkNewsletterAdTour':'Click to hide the newsletter ad.'}
							,{'chkSidebarTour':'Click to hide the sidebar completely.'}
							,{'chkAskQuestionTour' : 'Click to hide the Ask Question Button.'}
							,{'chkPostTaglistTour' : 'Click to hide the tags for the post.'}
							,{'chkRelatedPostsTour' : 'Click to hide the related posts.'}
							,{'chkNegativeVotedAnsTour': 'Click to hide the negative voted answers.'}
							];
		
    function getObjectValueByKeyFromArray(key, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][key]) {
                return arr[i][key];
            }
			else
			{
				console.log('Key: %s does not exists in array', key);
			}
        }
    }

    function updateKeyValueInChromeStorage(pair) {
        chrome.storage.sync.set(pair, function() {
            console.log('Updated pair %o from UI checkboxes', pair);
        });
    }

    function hideAllFlaggedElements(items) {
        for (var i = 0, len = mapping.length; i < len; i++) {
            var o = mapping[i];
            for (var j in o) {
                if (items[j] === true) {
					if(j === 'chkNegativeVotedAns')
					{
						hideShowDownvotedAns(o[j], true);
					}
					else
					{
						$(o[j]).hide();
					}
                }
            }
        }
    }

    function getTopN(data, n) {
        return data.slice(0, n);
    }

    function sortDescending(data) {
        return data.sort(function(a, b) {
            return b.val - a.val;
        });
    }

    function IsFirstTour() {
        return ((getTour()).length > 0) === false;
    }

    function getTour() {
        return $('input')
            .filter(function() {
                return this.id.match(/chk.*Tour/);
            });
    }

    function hideShowTour(isHide) {
        getTour().each(function() {
            isHide === true ? $(this).hide() : $(this).show();
        })
    }

    function createUITourOptions(chkSelector, uiSelector, tooltip) {
        var chkSelectorTour = chkSelector + 'Tour';
        var uiSelectorExists = true;
		var inputElement = $('<input style="position: relative; z-index: 4000; zoom:1.1" type="checkbox" id="' + chkSelectorTour + '" title="' + tooltip + '">');
        if ($(uiSelector).length > 1) {
            inputElement.insertBefore($($(uiSelector)[0]));
        } else if ($(uiSelector).length === 1) {
			if(chkSelector === 'chkAskQuestion')
			{
			inputElement.insertAfter(uiSelector);
			}
			else
			{
				inputElement.insertBefore(uiSelector);
			}
        } else {
            uiSelectorExists = false;
            console.log("Element %s not found in DOM", uiSelector);
        }

        if (uiSelectorExists === true) {
            chrome.storage.sync.get(chkSelector, function(items) {
                $('#' + chkSelectorTour)[0].checked = items[chkSelector];
            });

            $('#'+chkSelectorTour).click(function() {

                if ($('#' + chkSelectorTour)[0].checked === true) {
					if(chkSelectorTour === 'chkNegativeVotedAnsTour')
					{
						hideShowDownvotedAns(uiSelector, true);
					}
					else
					{
						$(uiSelector).hide();
					}
                } else {
                    updateKeyValueInChromeStorage({
                        chkSelectAll: false
                    });
					
					if(chkSelectorTour === 'chkNegativeVotedAnsTour')
					{
						hideShowDownvotedAns(uiSelector, false);
					}
					else
					{
						$(uiSelector).show();
					}
                }
                var emptyObj = {};
                emptyObj[chkSelector] = $('#' + chkSelectorTour)[0].checked;
                updateKeyValueInChromeStorage(emptyObj);
            });
        }
        return chkSelectorTour;
    }

	function hideShowDownvotedAns(uiSelector, isHide){
		$.each($(uiSelector), function(i, e) {
                if ($(e).text() < 0) {
					isHide ? $(this).closest('table').closest('div').hide() : $(this).closest('table').closest('div').show();
                }
            });
	}
	
    function openQuickSettings() {
        if (IsFirstTour()) {
            var tourCompatibleIds = [];
            for (var i = 0, len = mapping.length; i < len; i++) {
                var o = mapping[i];
                for (var j in o) {
                    tourCompatibleIds.push(createUITourOptions(j, o[j], getObjectValueByKeyFromArray(j + 'Tour', tourMessages)));
                }
            }
        } else {
            hideShowTour(false);
        }
    }

    function expandShowAllCommentsLinks(flag) {
        if (flag === true) {
            var showMoreCommentsLinks = $("a[title*='expand to show all comments on this post']");
            $.each(showMoreCommentsLinks, function(i, e) {
                if ($(e).html().length > 0) {
                    e.click();
                }
            });
        }
    }

    function highlightTopNPercentComments(weight, flag) {
        var comments = $("span[title*='useful comment']");
        var commentsToHighlight = Math.ceil(comments.length * weight);
        var data = [];

        $.each(comments, function(i,e) {
            data.push({
                key: $(e),
                val: $(e).text()
            });
        });

        data = sortDescending(data);
        data = getTopN(data, commentsToHighlight);

        $.each(data, function(i, e) {
            highlightElementsByTypeIfFlagged(e.key, flag, 'C');
        });
    }

    function highlightElementsByTypeIfFlagged(selector, flag, type) {
        if (flag === true && type == 'Q') {
            $($(selector)[0]).css("background-color", "#ffe6ff");
        } else if (flag === true && type == 'A') {
            $(selector).find(".answercell").css("background-color", "#e6ffe6");
        } else if (flag === true && type == 'C') {
            $(selector).closest('li').css("background-color", "#ffffb3");
        }
    }

    function getDefaultSettings() {
        var defaultSettings = { chkSelectAll: false };

		$.each(defaultList, function(i, e){
			defaultSettings[e] = true;
		})
		
        console.log('default settings: %o', defaultSettings);
        return defaultSettings;
    }

    function restoreOptions() {
        chrome.storage.sync.get(null, function(items) {
            var defaultSettings = getDefaultSettings();

            setSelectAllState(defaultSettings.chkSelectAll);
            setOptionsState(checkBoxList, defaultSettings);
            setSettingsInChromeStorage(defaultSettings, 'Settings has been restored.');
        });
    }

    function saveOptions() {
        var isSelectAll = getSelectAllState();
        var settings = {
            chkSelectAll: isSelectAll
        };
        settings = getOptionsState(checkBoxList, settings, isSelectAll);
        setSettingsInChromeStorage(settings, 'Successfully saved!');
    }

    function loadSavedSettings() {
        chrome.storage.sync.get(null, function(items) {
            console.log('Previosly saved settings: %o', items);
            if (JSON.stringify(items) != '{}') {
                setSelectAllState(items.chkSelectAll);
                setOptionsState(checkBoxList, items);
            } else {
                restoreOptions();
            }
        });
    }

    function setSelectAllState(value) {
        $('#chkSelectAll')[0].checked = value;
    }

    function setOptionsState(selectors, states) {
        for (var i = 0, len = selectors.length; i < len; ++i) {
            $('#' + selectors[i])[0].checked = states[selectors[i]];
        }
    }

    function checkIfSelectAllToBeUnset() {
        checkBoxList.forEach(function(selector) {
            $('#'+selector).click(function() {
                if ($('#' + selector)[0].checked === true) {
                    //make text bold
                } else {
                    $('#chkSelectAll')[0].checked = false;
                }
            });
        });
    }

    function setDefaultSettingsInChromeStorage() {
        var defaultSettings = getDefaultSettings();
        chrome.storage.sync.set(defaultSettings);
    }

    function setSettingsInChromeStorage(settings, msg) {
        chrome.storage.sync.set(settings, function() {
            var status = document.getElementById('status');
            status.textContent = msg;
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        });
    }

    function selectAll() {
        var isSelectAll = getSelectAllState();
        checkBoxList.forEach(function(item) {
            $('#' + item)[0].checked = isSelectAll;
        });
    }

    function getOptionsState(selectors, states, isSelectAll) {
        for (var i = 0, len = selectors.length; i < len; ++i) {
            states[selectors[i]] = isSelectAll || $('#' + selectors[i])[0].checked;
        }
        return states;
    }

    function getSelectAllState() {
        return $('#chkSelectAll')[0].checked;
    }

    function changeUI(items) {
        hideShowTour(true);
        hideAllFlaggedElements(items);
        expandShowAllCommentsLinks(items.chkExpandComments);
        highlightElementsByTypeIfFlagged('.post-text', items.chkHighlightQues, 'Q');
        highlightElementsByTypeIfFlagged('.accepted-answer', items.chkHighlightAcceptedAns, 'A');

        var weight = 0.25;
        highlightTopNPercentComments(weight, items.chkHighlightImpComments);
    }

    return {
        openQuickSettings: openQuickSettings,
        restoreOptions: restoreOptions,
        saveOptions: saveOptions,
        loadSavedSettings: loadSavedSettings,
        selectAll: selectAll,
        checkIfSelectAllToBeUnset: checkIfSelectAllToBeUnset,
        setDefaultSettingsInChromeStorage: setDefaultSettingsInChromeStorage,
        changeUI: changeUI
    };
}());
