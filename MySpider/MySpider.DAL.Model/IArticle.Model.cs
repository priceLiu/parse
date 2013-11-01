using Peanut.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.DAL.Model
{
    ///<summary>
    ///Peanut Generator Copyright @ FanJianHan 2010-2013
    ///website:http://www.ikende.com
    ///</summary>
    [Table("Article")]
    public partial class Article : Peanut.Mappings.DataObject
    {
        private int mId;
        public static Peanut.FieldInfo<int> id = new Peanut.FieldInfo<int>("Article", "Id");
        private string mTitle;
        public static Peanut.FieldInfo<string> title = new Peanut.FieldInfo<string>("Article", "Title");
        private string mSummary;
        public static Peanut.FieldInfo<string> summary = new Peanut.FieldInfo<string>("Article", "Summary");
        private bool mIsRecommend;
        public static Peanut.FieldInfo<bool> isRecommend = new Peanut.FieldInfo<bool>("Article", "IsRecommend");
        private string mNavUrl;
        public static Peanut.FieldInfo<string> navUrl = new Peanut.FieldInfo<string>("Article", "NavUrl");
        private int mStarCount;
        public static Peanut.FieldInfo<int> starCount = new Peanut.FieldInfo<int>("Article", "StarCount");
        private int mBrowsedCount;
        public static Peanut.FieldInfo<int> browsedCount = new Peanut.FieldInfo<int>("Article", "BrowsedCount");
        private string mPosted;
        public static Peanut.FieldInfo<string> posted = new Peanut.FieldInfo<string>("Article", "Posted");
        private DateTime mCreated;
        public static Peanut.FieldInfo<DateTime> created = new Peanut.FieldInfo<DateTime>("Article", "Created");
        ///<summary>
        ///Type:int
        ///</summary>
        [ID()]
        public virtual int Id
        {
            get
            {
                return mId;
                
            }
            set
            {
                mId = value;
                EntityState.FieldChange("Id");
                
            }
            
        }
        ///<summary>
        ///Type:string
        ///</summary>
        [Column()]
        public virtual string Title
        {
            get
            {
                return mTitle;
                
            }
            set
            {
                mTitle = value;
                EntityState.FieldChange("Title");
                
            }
            
        }
        ///<summary>
        ///Type:string
        ///</summary>
        [Column()]
        public virtual string Summary
        {
            get
            {
                return mSummary;
                
            }
            set
            {
                mSummary = value;
                EntityState.FieldChange("Summary");
                
            }
            
        }
        ///<summary>
        ///Type:bool
        ///</summary>
        [Column()]
        public virtual bool IsRecommend
        {
            get
            {
                return mIsRecommend;
                
            }
            set
            {
                mIsRecommend = value;
                EntityState.FieldChange("IsRecommend");
                
            }
            
        }
        ///<summary>
        ///Type:string
        ///</summary>
        [Column()]
        public virtual string NavUrl
        {
            get
            {
                return mNavUrl;
                
            }
            set
            {
                mNavUrl = value;
                EntityState.FieldChange("NavUrl");
                
            }
            
        }
        ///<summary>
        ///Type:int
        ///</summary>
        [Column()]
        public virtual int StarCount
        {
            get
            {
                return mStarCount;
                
            }
            set
            {
                mStarCount = value;
                EntityState.FieldChange("StarCount");
                
            }
            
        }
        ///<summary>
        ///Type:int
        ///</summary>
        [Column()]
        public virtual int BrowsedCount
        {
            get
            {
                return mBrowsedCount;
                
            }
            set
            {
                mBrowsedCount = value;
                EntityState.FieldChange("BrowsedCount");
                
            }
            
        }
        ///<summary>
        ///Type:string
        ///</summary>
        [Column()]
        public virtual string Posted
        {
            get
            {
                return mPosted;
                
            }
            set
            {
                mPosted = value;
                EntityState.FieldChange("Posted");
                
            }
            
        }
        ///<summary>
        ///Type:DateTime
        ///</summary>
        [Column()]
        public virtual DateTime Created
        {
            get
            {
                return mCreated;
                
            }
            set
            {
                mCreated = value;
                EntityState.FieldChange("Created");
                
            }
            
        }
        
    }
    
}
