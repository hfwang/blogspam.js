//
// Stock methods.
//
exports.name    = function() {return "25-subject.js" ; };
exports.purpose = function() {return "Known-bad subjects." ; };
exports.author  = function() { return "Steve Kemp <steve@steve.org.uk>" };


//
//  Many times I've seen strings in the name-field which are always
// spam.
//
exports.testJSON = function ( obj, spam, ok, next )
{
    var ip    = obj['ip']      || ""
    var subj  = obj['subject'] || ""
    var redis = obj['_redis']

    //
    //  We don't want to be too strict here, but even so ..
    //
    var bad = [
        "^authentic.*jerseys",
        "^cheap.*wholesale",
    ];

    //
    // For each bad-subject we've got.
    //
    subj.forEach(function(spam_str) {

        //
        // If we match..
        //
        if ( subj.match( new RegExp( spam_str, "i" ) ) )
        {
            //
            // Blacklist for 12 hours.
            //
            var res = "Blacklisted subject";

            redis.set(    "blacklist-" + ip , res );
            redis.expire( "blacklist-" + ip , 60*60*12 );

            spam( res );
            return;
        }
    });

    next( "next" );
};
