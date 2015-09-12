angular.module('FAQCtrl', []).controller('FAQCtrl', ['$scope', '$sce', function($scope, $sce) {
    $scope.FAQs = [
        {question:'Who/what we are:', answer: 'RPI Ambulance is a student-run volunteer organization/ agency ' +
            'certified by NY state to provide emergency medical service to our area. This alone says one important thing ' +
            '&mdash; with only a few exceptions, we are all students, and of course we understand classes and homework ' +
            'are the #1 priority of our members.'},
        {question:'What services does RPI Ambulance provide?', answer: 'RPI Ambulance provides a Basic Life Support ' +
            '(BLS) ambulance services to the RPI community and surrounding area. We provide first response medical ' +
            'assistance and transport services 24/7 while classes are in session. We also provide emergency medical ' +
            'services at sporting and other special events on campus.'},
        {question:'How much does an ambulance ride to the hospital cost?', answer: 'Services provided by RPI Ambulance ' +
            'are completely free! While some ambulance agencies may bill, RPI ambulance is completely free of charge.'},
        {question:'What prior experience do I need?', answer: 'Absolutely nothing. We do not require any training to ' +
            'join, but highly encourage training once a member. If you already have a non-New York EMT certification, ' +
            'talk to one of our officers about getting reciprocity in NY state.'},
        {question:'What training is provided to me and what positions can I achieve?', answer: 'We provide training for ' +
            'almost all of our levels at no cost to you. You will begin at RPIA as an Observer. Observers have no training ' +
            'and do exactly what you think they would do, observe. The next level up is Attendant. An attendant is trained ' +
            'in CPR and has gone through a short class to understand the basic layout of the ambulance, how to use the ' +
            'equipment, as well as how to perform basic assessment skills. They assist the crew and work under the direct ' +
            'supervision of the crew chief. The other two positions available are Driver and Crew Chief. Drivers go through ' +
            'our Driver Training program. Before they can officially become a driver they must be an attendant and pass ' +
            'a promotional board. Crew Chiefs are the highest position within the agency and hold the most responsibility. ' +
            'They must be New York State EMTs and go through our Crew Chief Class. Classes are typically held once a year, ' +
            'but if the demand is present, they can be done more frequently.'},
        {question:'How do I become an EMT?', answer: 'This question is asked frequently at the student activity fair ' +
            '&mdash; which is great! The more certified people, the better! There is usually an EMT class held every ' +
            'semester. These classes are not taught by RPI Ambulance; they are taught by certified EMT Instructors. Please ' +
            'contact one of the officers for more information.'},
        {question:'I am an EMT but am not a New York State EMT. What now?', answer: 'Great! We can get you information ' +
            'on who to contact to apply for reciprocity and have your certification carry over to New York State. For ' +
            'information, please contact one of the officers and see the <a href="EMT-reciprocity.html">NYS EMS Reciprocity</a> ' +
            'page.'},
        {question:'Do I get paid?', answer: 'Sorry. We are all volunteers and work for no monetary compensation. But ' +
            'if you are working with RPI Ambulance at a hockey game, football game or the Houston Field House concert you ' +
            'will probably get to see some or all of the show for free.'},
        {question:'Are there any requirements to join?', answer: 'Just one! Each year all of our members have to attend ' +
            'a 1 hour OSHA lecture. They are typically held at the beginning of the semester (check out the calendar) ' +
            'but we can set up special dates for those of you who join throughout the semester. Please feel free to ' +
            'contact us if you have any further questions at <a href="mailto:officers@rpiambulance.com">officers@rpiambulance.com</a>'}
    ];

}]);